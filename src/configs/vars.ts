import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

import { envs } from '../constants'

dotenv.config()

const env = process.env.NODE_ENV ?? envs.DEV

export const vars = {
  port: process.env.PORT ?? 3000,
  socketPort: process.env.SOCKET_PORT ?? 3001,
  env,
  mongo: {
    servers: process.env.MONGO_SERVERS ?? '127.0.0.1:27017',
    dbName:
      env === envs.TEST
        ? process.env.MONGO_DB_NAME_TEST ?? 'db-test'
        : process.env.MONGO_DB_NAME ?? 'landing-page',
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    repls: process.env.MONGO_REPLS
  }
}

export const accessTokenSettings = {
  secret: process.env.ACCESS_TOKEN_SECRET ?? 'secret_1',
  expireTime: Number(process.env.ACCESS_TOKEN_SECRET) ?? 1, // day
  activateTokenExp: process.env.ACTIVATE_TOKEN_EXP ?? '',
  forgotPwdExp: process.env.FORGOT_PWD_EXP ?? '',
  accessTokenExp: process.env.ACCESS_TOKEN_EXP ?? ''
}

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})
