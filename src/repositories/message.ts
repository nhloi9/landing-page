import { v4 } from 'uuid'

import { Message } from '../models'
import { type IQueryParams, type IMessage } from '../types'
import { sortTypes } from '../constants'

const createMessage = async (message: IMessage): Promise<IMessage> => {
  const newMessage = new Message({ ...message, id: v4() })
  return await newMessage.save()
}

const getUserMessages = async (
  userId: string,
  queryParams: IQueryParams
): Promise<IMessage[]> => {
  const [sortType, skip, limit] = [
    queryParams.sortType ?? sortTypes.NEWEST,
    queryParams.skip ?? 0,
    queryParams.limit ?? 15
  ]
  const messages = await Message.aggregate([
    {
      $lookup: {
        from: 'conversations',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$userId', userId]
              }
            }
          }
        ],
        as: 'conversation'
      }
    },
    {
      $match: {
        $expr: {
          $eq: ['$conversationId', { $arrayElemAt: ['$conversation.id', 0] }]
        }
      }
    },
    { $sort: { createdAt: sortType } },
    {
      $project: {
        _id: 0,
        conversation: 0,
        reqConversationId: 0
      }
    },
    { $skip: skip },
    { $limit: limit }
  ])
  return messages as IMessage[]
}

const getAdminMessages = async (
  conversationId: string,
  queryParams: IQueryParams
): Promise<IMessage[]> => {
  const [sortType, skip, limit] = [
    queryParams.sortType ?? sortTypes.NEWEST,
    queryParams.skip ?? 0,
    queryParams.limit ?? 15
  ]
  const messages = await Message.find({ conversationId }, { _id: 0 })
    .sort({ createdAt: sortType })
    .limit(limit)
    .skip(skip)

  return messages as IMessage[]
}

export { createMessage, getAdminMessages, getUserMessages }
