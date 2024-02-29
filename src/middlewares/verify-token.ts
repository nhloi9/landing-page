import jwt, { type JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { type IncomingHttpHeaders } from 'http'
import httpStatus from 'http-status'
import { type Response } from 'express'

import { accessTokenSettings } from '../configs'
import { type RequestPayload } from '../types'
import { getApiResponse } from '../utils'
import { messages, roles } from '../constants'

const getToken = (headers: IncomingHttpHeaders): string => {
  const { authorization } = headers
  if (authorization == null) {
    throw new Error('Invalid header')
  }
  const [tokenType, token] = authorization.split(' ')
  if (tokenType !== 'Bearer' || token === undefined || token === '') {
    throw new Error('Invalid header')
  }
  return token
}

export const verifyToken = (req: RequestPayload, res: Response, next: any) => {
  try {
    const token = getToken(req.headers)
    const payload = jwt.verify(token, accessTokenSettings.secret) as JwtPayload
    console.log('[verify-token]', payload)
    req.payload = payload
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(getApiResponse(messages.ACCESS_TOKEN_EXPIRED))
    }
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(getApiResponse(messages.ACCESS_TOKEN_INVALID))
  }
}

export const isAdmin = (req: RequestPayload, res: Response, next: any) => {
  if (req.payload !== null) {
    const { role } = req.payload as JwtPayload
    if (role === roles.ADMIN) return next()
  }
  return res
    .status(httpStatus.UNAUTHORIZED)
    .json(getApiResponse(messages.ROLE_INVALID))
}

export const verifyAdmin = (
  req: RequestPayload,
  res: Response,
  next: any
) => {
  verifyToken(req, res, () => {
    if (typeof req.payload === 'object' && req.payload?.role === roles.ADMIN) {
      return next()
    }

    return res
      .status(httpStatus.FORBIDDEN)
      .json(getApiResponse(messages.YOU_ARE_NOT_ALLOWED))
  })
}

export const verifyUser = (
  req: RequestPayload,
  res: Response,
  next: any
) => {
  verifyToken(req, res, () => {
    if (typeof req.payload === 'object' && req.payload?.role === roles.USER) {
      return next()
    }

    return res
      .status(httpStatus.FORBIDDEN)
      .json(getApiResponse(messages.YOU_ARE_NOT_ALLOWED))
  })
}
