import { type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'

import { type IQueryParams, type IMessage, type RequestPayload } from '../types'
import { getApiResponse } from '../utils'
import { messageRepo, conversationRepo } from '../repositories'
import {
  connTypes,
  messages,
  roleTypes,
  roles,
  socketMessages
} from '../constants'
import { type WebSocket } from 'uWebSockets.js'
import { socketControllers } from '.'

export const getMessages = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams: IQueryParams = req.query as unknown as IQueryParams

    if (typeof req.payload === 'object' && 'id' in req.payload) {
      let roleType: number
      const role = req.payload.role
      let resMessages: IMessage[]

      if (role === roles.USER) {
        roleType = roleTypes.USER
        resMessages = await messageRepo.getUserMessages(
          req.payload.id,
          queryParams
        )
      } else { // role === roles.ADMIN
        roleType = roleTypes.ADMIN
        resMessages = await messageRepo.getAdminMessages(
          req.params.conversationId,
          queryParams
        )
      }

      // set 'seen' for the conversation
      if (resMessages.length !== 0) {
        const updatedConvo = await conversationRepo.setSeenForConversation(
          roleType,
          resMessages[0].conversationId
        )

        if (updatedConvo !== null && 'id' in updatedConvo) {
          socketControllers.sendUpdatedConvo(
            socketMessages.SEEN,
            updatedConvo.id as string,
            connTypes.ADMIN,
            updatedConvo
          )
        }
      }

      res.status(httpStatus.OK).json(getApiResponse({ data: resMessages }))
    } else {
      res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.INVALID_PAYLOAD))
    }
  } catch (error) {
    next(error)
  }
}

export const sendMessage = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      typeof req.payload === 'object' &&
      'role' in req.payload &&
      'id' in req.payload
    ) {
      let conversationId: string
      const { id, role } = req.payload
      if (role === roles.USER) {
        conversationId = await conversationRepo.getConversationIdByUserId(id)
      } else { // role === roles.ADMIN
        conversationId = req.params.conversationId
      }

      const newMessage = await messageRepo.createMessage({
        ...req.body,
        sender: req.payload.role,
        conversationId
      })

      // update latest message when send a new message
      await conversationRepo.updateLatestMessage(newMessage)

      res.status(httpStatus.OK).json(getApiResponse({ data: newMessage }))
    } else {
      res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.INVALID_PAYLOAD))
    }
  } catch (error) {
    next(error)
  }
}

export const saveSocketMessage = async (
  ws: WebSocket<unknown>,
  message: IMessage
) => {
  try {
    const newMessage = await messageRepo.createMessage(message)

    const { updatedAt, createdAt, ...msg } = JSON.parse(
      JSON.stringify(newMessage)
    )

    // update latest message when send a new message
    const updatedConvo = await conversationRepo.updateLatestMessage(
      msg as IMessage
    )

    return { newMessage, updatedConvo }
  } catch (error) {
    ws.close()
  }
}
