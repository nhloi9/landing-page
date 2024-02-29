import { type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'

import { type IQueryParams, type RequestPayload } from '../types'
import { conversationRepo } from '../repositories'
import { getApiResponse } from '../utils'

export const adminGetConversations = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams: IQueryParams = req.query as unknown as IQueryParams
    const search = req.query.search ?? ''
    const conversations = await conversationRepo.getConversations(
      queryParams,
      search as unknown as string
    )

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ data: conversations }))
  } catch (error) {
    next(error)
  }
}

export const userGetConversation = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = typeof req.payload === 'string' ? null : req.payload?.id
    const conversation = await conversationRepo.getConversation({ userId })

    res.status(httpStatus.OK).json(getApiResponse({ data: conversation }))
  } catch (error) {
    next(error)
  }
}
