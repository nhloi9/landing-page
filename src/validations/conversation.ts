import { Joi, type schema } from 'express-validation'

import validate from './validate'
import { sortTypes } from '../constants'

const getConversations: schema = {
  query: Joi.object({
    sortType: Joi.number().valid(
      ...Object.values(sortTypes).filter(x => typeof x === 'number')
    ),
    limit: Joi.number().min(5),
    skip: Joi.number().min(0),
    search: Joi.string()
  })
}

export const conversationValidation = {
  getConversations: validate(getConversations)
}
