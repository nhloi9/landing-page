import { Schema, model } from 'mongoose'

import { type IFreeTrial } from '../types'

const FreeTrialSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      index: true
    },
    phone: {
      type: Number,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    projectDescription: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const FreeTrial = model<IFreeTrial>('free-trial', FreeTrialSchema)
