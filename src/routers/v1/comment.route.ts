import { Router } from 'express'

import { commentControllers as controller } from '../../controllers'
import { commentValidation as validation } from '../../validations'
import { verifyToken } from '../../middlewares'

const router = Router()

router
  .route('/')
  .post(verifyToken, validation.createComment, controller.createComment)
  .get(validation.getComments, controller.getComments)

router
  .route('/:id')
  .delete(verifyToken, controller.deleteComment)
  .put(verifyToken, validation.updateComment, controller.updateComment)

export default router
