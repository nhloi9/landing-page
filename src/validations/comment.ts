import { Joi, type schema } from 'express-validation'

import validate from './validate'

const createComment: schema = {
  body: Joi.object({
    receiver: Joi.string(),
    content: Joi.string().required(),
    parentId: Joi.string(),
    resourceId: Joi.string().required()
  })
}

const getComments: schema = {
  query: Joi.object({
    timeCusor: Joi.number().integer().min(1),
    resourceId: Joi.string().required(),
    limitPerPage: Joi.number().integer().min(1).required()
  })
}

const updateComment: schema = {
  body: Joi.object({
    content: Joi.string().required()
  })
}

export const commentValidation = {
  createComment: validate(createComment),
  getComments: validate(getComments),
  updateComment: validate(updateComment)
}
