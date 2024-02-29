import jwt from 'jsonwebtoken'

import { accessTokenSettings } from '../configs'

// Tạo token
export const createToken = (payload: any, expireIn?: any): string => {
  if (expireIn != null) {
    return jwt.sign(payload, accessTokenSettings.secret, { expiresIn: expireIn })
  } else {
    return jwt.sign(payload, accessTokenSettings.secret)
  }
}
