import { type Request, type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'

import { commentRepo } from '../repositories'
import { getApiResponse } from '../utils'
import { messages, roles } from '../constants'
import { type RequestPayload } from '../types'
import { User } from '../models'

export const createComment = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const createComment = await commentRepo.createComment({
      ...req.body,
      sender: req.payload?.id
    })
    res.status(httpStatus.CREATED).json(getApiResponse({ data: createComment }))
  } catch (error) {
    next(error)
  }
}

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [comments, users] = await Promise.all([
      commentRepo.getComments(req.query),
      User.find({ isActivated: true }).select('id firstName lastName role -_id')
    ])
    const { limitPerPage } = req.query as any
    let nextCusor
    if (comments.length > limitPerPage) {
      nextCusor = new Date(
        comments.splice(limitPerPage, 1)[0].createdAt
      ).getTime()
    }
    const findUser = (userId: any) => {
      const data: any = users.find(item => item.id === userId)
      return data
    }
    const populateComment = (comment: any) => {
      return {
        ...comment,
        sender: findUser(comment.sender),
        receiver: findUser(comment.receiver)
      }
    }

    const populatedComments = comments.map((comment: any) => {
      return {
        ...populateComment(comment),
        answers: comment.answers.map((comment: any) => {
          return populateComment(comment)
        })
      }
    })

    res
      .status(httpStatus.OK)
      .json(
        getApiResponse({ data: { comments: populatedComments, nextCusor } })
      )
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await commentRepo.getComment(req.params.id)
    if (comment === null) {
      res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.COMMENT_NOT_FOUND))
    } else {
      if (
        req.payload?.role !== roles.ADMIN &&
        req.payload?.id !== comment.sender
      ) {
        res
          .status(httpStatus.BAD_REQUEST)
          .json(getApiResponse(messages.COMMENT_NOT_ALLOWED_DELETE))
      } else {
        await Promise.all([
          commentRepo.deleteComment(comment.id),
          commentRepo.deleteChildComments(comment.id)
        ])
        res
          .status(httpStatus.OK)
          .json(getApiResponse(messages.COMMENT_DElETED_SUCCESS))
      }
    }
  } catch (error) {
    next(error)
  }
}
export const updateComment = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await commentRepo.updateComment(
      req.params.id,
      req.payload?.id,
      req.body.content
    )
    if (comment === null) {
      res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.COMMENT_NOT_FOUND))
    } else {
      res.status(httpStatus.OK).json(getApiResponse({ data: comment }))
    }
  } catch (error) {
    next(error)
  }
}
