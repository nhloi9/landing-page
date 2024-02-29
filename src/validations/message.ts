import { Joi, type schema } from 'express-validation'

import validate from './validate'
import { sortTypes } from '../constants'

const createMessage: schema = {
  body: Joi.object({
    content: Joi.string().required()
  })
}

const createAdminMessage: schema = {
  ...createMessage,
  params: Joi.object({
    conversationId: Joi.string().required()
  })
}

const getMessages: schema = {
  query: Joi.object({
    sortType: Joi.number().valid(
      ...Object.values(sortTypes).filter(x => typeof x === 'number')
    ),
    limit: Joi.number().min(5),
    skip: Joi.number().min(0)
  })
}

const getAdminMessages: schema = {
  ...getMessages,
  params: Joi.object({
    conversationId: Joi.string().required()
  })
}

export const msgValidation = {
  createMessage: validate(createMessage),
  createAdminMessage: validate(createAdminMessage),
  getMessages: validate(getMessages),
  getAdminMessages: validate(getAdminMessages)
}
