import { Router } from 'express'

import { fileControllers as controller } from '../../controllers'
import { upload } from '../../utils'
import { isAdmin, verifyToken } from '../../middlewares'

const router = Router()

router
  .route('/')
  .post(verifyToken, isAdmin, upload.single('file'), controller.uploadFile)
router.route('/:fileName').delete(verifyToken, isAdmin, controller.deleteFile)

export default router
