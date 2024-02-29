import { Router } from 'express'

import { userControllers as controller } from '../../controllers'
import { userValidation as validation } from '../../validations'
import { isAdmin, verifyToken } from '../../middlewares'

const router = Router()

router.route('/login').post(controller.login)
router.route('/register').post(validation.registerUser, controller.registerUser)
router.route('/verify-email/:activateToken').get(controller.activeAccount)
router.route('/forgotPassword').post(controller.forgotPassword)
router
  .route('/reset-password/:resetPasswordToken')
  .get(controller.resetPassword)
router
  .route('/change-password/')
  .post(verifyToken, validation.changePassword, controller.changePassword)
router.route('/').get(verifyToken, controller.getUser)
router.route('/list').get(verifyToken, isAdmin, controller.getUsers)
router
  .route('/')
  .post(verifyToken, isAdmin, validation.createUser, controller.createUser)
router
  .route('/:userId')
  .put(verifyToken, isAdmin, validation.updateUser, controller.updateUser)
router.route('/:userId').delete(verifyToken, isAdmin, controller.deleteUser)
export default router
