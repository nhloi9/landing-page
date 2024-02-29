import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

import { type IUser } from '../types'
import { roles } from '../constants'

const UserSchema = new Schema(
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
    name_en: {
      type: String,
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      default: roles.USER
    },
    isActivated: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

UserSchema.pre('save', async function (next) {
  // Nếu mật khẩu không được thay đổi, bỏ qua
  if (!this.isModified('password')) {
    next()
  }
  // Mã hóa mật khẩu
  this.password = await bcrypt.hash(this.password, 10)
})
export const User = model<IUser>('user', UserSchema)
