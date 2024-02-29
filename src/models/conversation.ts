import { Schema, model } from 'mongoose'

import { type IConversation } from '../types'
import { roles } from '../constants'

const ConversationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
      ref: 'user',
      field: 'id'
    },
    latestMsg: {
      type: {
        sender: {
          type: String,
          required: true,
          enum: [roles.ADMIN, roles.USER]
        },
        content: {
          type: String,
          required: true
        }
      },
      // required: true,
      default: null
    },
    isSeen: {
      type: Array<boolean>(2),
      require: true,
      default: [false, false]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Conversation = model<IConversation>('conversation', ConversationSchema)
