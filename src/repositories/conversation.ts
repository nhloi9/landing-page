import { v4 } from 'uuid'

import { Conversation } from '../models'
import { type IMessage, type IConversation, type IQueryParams } from '../types'
import { roleTypes, roles, sortTypes } from '../constants'

const createConversation = async (
  conversation: IConversation
): Promise<IConversation> => {
  const newConversation = new Conversation({ ...conversation, id: v4() })
  return await newConversation.save()
}

const updateLatestMessage = async (msg: IMessage): Promise<object> => {
  const isSeen: boolean[] = [false, false]
  if (msg.sender === roles.USER) {
    isSeen[roleTypes.USER] = true
  } else {
    isSeen[roleTypes.ADMIN] = true
  }

  await Conversation.findOneAndUpdate(
    { id: msg.conversationId },
    {
      latestMsg: {
        sender: msg.sender,
        content: msg.content
      },
      isSeen
    }
  )

  const updatedConvo = {
    id: msg.conversationId,
    latestMsg: {
      sender: msg.sender,
      content: msg.content
    },
    isSeen
  }
  return updatedConvo
}

const getConversation = async (queryOptions: object = {}): Promise<object> => {
  const convos = await Conversation.aggregate([
    {
      $match: queryOptions
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'id',
        as: 'user'
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: ['$user', 0] }
      }
    },
    {
      $project: {
        id: 1,
        'user.firstName': 1,
        'user.lastName': 1,
        'user.id': 1,
        latestMsg: 1,
        isSeen: 1,
        updatedAt: 1,
        createdAt: 1,
        _id: 0
      }
    },
    {
      $unset: ['latestMsg._id']
    }
  ])
  return convos.length === 0 ? {} : convos[0]
}

const getConversations = async (
  queryParams: IQueryParams,
  searchOptions: string = ''
): Promise<object[]> => {
  const [sortType, skip, limit] = [
    queryParams.sortType ?? sortTypes.NEWEST,
    queryParams.skip ?? 0,
    queryParams.limit ?? 15
  ]

  const match: object = searchOptions === ''
    ? {
        $expr: {
          $ne: ['$latestMsg', null]
        }
      }
    : {
        $or: [
          { 'user.name_en': { $regex: searchOptions, $options: 'i' } }
        ]
      }
  const conversations = await Conversation.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'id',
        as: 'user'
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: ['$user', 0] }
      }
    },
    {
      $match: match
    },
    { $sort: { updatedAt: sortType } },
    {
      $project: {
        id: 1,
        'user.firstName': 1,
        'user.lastName': 1,
        'user.id': 1,
        latestMsg: 1,
        isSeen: 1,
        updatedAt: 1,
        createdAt: 1,
        _id: 0
      }
    },
    {
      $unset: ['latestMsg._id']
    },
    { $skip: skip },
    { $limit: limit }
  ])
  return conversations
}

const getConversationIdByUserId = async (userId: string): Promise<string> => {
  const conversation = await Conversation.findOne({ userId })
  return conversation?.id ?? ''
}

const setSeenForConversation = async (
  roleType: number,
  conversationId: string
): Promise<object | null> => {
  const conversation = await Conversation.findOne({
    id: conversationId
  })

  if (conversation !== null) {
    // check if the conversation is seen by role type
    if (!conversation.isSeen[roleType]) {
      conversation.isSeen[roleType] = true
      await Conversation.findOneAndUpdate({ id: conversationId }, conversation)

      const updatedConvo = {
        id: conversationId,
        isSeen: conversation.isSeen
      }
      return updatedConvo
    }
  }
  return null
}

export {
  createConversation,
  updateLatestMessage,
  getConversation,
  getConversations,
  getConversationIdByUserId,
  setSeenForConversation
}
