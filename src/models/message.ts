import { Schema, model } from 'mongoose'

import { type IMessage } from '../types'
import { roles } from '../constants'

const MessageSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: String,
      required: true,
      enum: [roles.ADMIN, roles.USER]
    },
    conversationId: {
      type: String,
      required: true,
      ref: 'conversation',
      field: 'id'
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Message = model<IMessage>('message', MessageSchema)
