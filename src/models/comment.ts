import { Schema, model } from 'mongoose'

import { type IComment } from '../types'

const CommentSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: String,
      required: true
    },
    receiver: {
      type: String
    },
    content: {
      type: String,
      required: true
    },
    parentId: {
      type: String
    },
    resourceId: { type: String, required: true }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Comment = model<IComment>('comment', CommentSchema)
