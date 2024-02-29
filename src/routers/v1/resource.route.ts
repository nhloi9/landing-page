import { Router } from 'express'

import { resourceControllers as controller } from '../../controllers'
import { isAdmin, verifyToken } from '../../middlewares'
import { resourceValidation as validation } from '../../validations'

const router = Router()

router
  .route('/')
  .post(
    verifyToken,
    isAdmin,
    validation.createResource,
    controller.createResource
  )
  .get(validation.getResources, controller.getResources)

router
  .route('/:resourceId')
  .put(
    verifyToken,
    isAdmin,
    validation.updateResource,
    controller.updateResource
  )
  .get(controller.getResource)
  .delete(verifyToken, isAdmin, controller.deleteResource)

export default router
