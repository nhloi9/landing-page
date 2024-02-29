import mongoose from 'mongoose'

import type { MongoSettings } from '../types'

import { vars } from '../configs'
import { envs } from '../constants'

mongoose.Promise = Promise

mongoose.connection.on('error', (err: Error) => {
  console.log(`[database]-[mongo] error ${err.message}`)
  process.exit(1)
})

const makeMongoURI = (mongoSettings: MongoSettings): string => {
  const { servers, username, password, repls } = mongoSettings
  const hostURL = servers.split(' ').join(',')
  const loginOption =
    username != null && password != null ? `${username}:${password}@` : ''
  const replOption = repls != null ? `?replicaSet=${repls}` : ''

  return `mongodb://${loginOption}${hostURL}/${replOption}`
}

const connect = async (): Promise<any> => {
  const uri = makeMongoURI(vars.mongo)
  if (vars.env === envs.DEV) {
    mongoose.set('debug', true)
  }
  console.info(`[database]-[mongo] connecting to ${uri}`)
  return await mongoose.connect(uri, {
    dbName: vars.mongo.dbName
  })
}

export = { connect }
