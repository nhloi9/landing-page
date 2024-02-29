import { Joi, type schema } from 'express-validation'

import validate from './validate'

const createFreeTrial: schema = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).required(),
    country: Joi.string().required(),
    projectDescription: Joi.string().required().max(1024)
  })
}

export const freeTrialValidation = {
  freeTrial: validate(createFreeTrial)
}
