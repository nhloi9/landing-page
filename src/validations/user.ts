import { Joi, type schema } from 'express-validation'

import validate from './validate'
import { roles } from '../constants'

const createUser: schema = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().min(10).required(),
    country: Joi.string().required(),
    role: Joi.string().valid(roles.USER, roles.ADMIN).required()
  })
}

const getUser: schema = {
  query: Joi.object({
    email: Joi.string()
  })
}

const registerUser: schema = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .min(6),
    phone: Joi.string()
      .required()
      .pattern(/^\d{10,20}$/),
    country: Joi.string().required()
  })
}
const changePassword: schema = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .required()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .min(6),
    confirmNewPassword: Joi.string().required()
  })
}
const updateUser: schema = {
  body: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    phone: Joi.string()
      .required()
      .pattern(/^\d{10,20}$/),
    country: Joi.string().required()
  })
}

export const userValidation = {
  createUser: validate(createUser),
  getUser: validate(getUser),
  registerUser: validate(registerUser),
  changePassword: validate(changePassword),
  updateUser: validate(updateUser)
}
