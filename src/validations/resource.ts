import { Joi, type schema } from 'express-validation'

import validate from './validate'
import { resourceCategories } from '../constants'

const createResource: schema = {
  body: Joi.object({
    author: Joi.string(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    category: Joi.string()
      .required()
      .custom(value => {
        if (resourceCategories.includes(value)) return value
        else throw new Error('invalid category')
      }),
    description: Joi.string(),
    thumbnail: Joi.string().required()
  })
}
const updateResource: schema = {
  body: Joi.object({
    author: Joi.string(),
    title: Joi.string(),
    content: Joi.string(),
    category: Joi.string().custom(value => {
      if (resourceCategories.includes(value)) return value
      else throw new Error('invalid category')
    }),
    description: Joi.string(),
    thumbnail: Joi.string()
  })
}

const getResources: schema = {
  query: Joi.object({
    category: Joi.string()
      .required()
      .custom(value => {
        if (resourceCategories.includes(value)) return value
        else throw new Error('invalid category')
      }),
    keyword: Joi.string(),
    page: Joi.number().min(1).integer(),
    limitPerPage: Joi.number().min(1).integer().required()
  })
}

export const resourceValidation = {
  createResource: validate(createResource),
  getResources: validate(getResources),
  updateResource: validate(updateResource)
}
