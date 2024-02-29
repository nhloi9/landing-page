import { Schema, model } from 'mongoose'

import { type IResource } from '../types'

const ResourceSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: true
    },
    author: { type: String },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    category: {
      type: String,
      required: true
    },
    thumbnail: { type: String, required: true }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
ResourceSchema.index({
  title: 'text'
})

export const Resource = model<IResource>('resource', ResourceSchema)
