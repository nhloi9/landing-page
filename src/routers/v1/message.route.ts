import { Router } from 'express'

import { messageControllers as controller } from '../../controllers'
import { msgValidation as validation } from '../../validations'
import { verifyAdmin, verifyUser } from '../../middlewares'
// import { Message } from '../../models'

const router = Router()

router
  .route('/:conversationId')
  .post(verifyAdmin, validation.createAdminMessage, controller.sendMessage)
  .get(verifyAdmin, validation.getAdminMessages, controller.getMessages)

router
  .route('/')
  .post(verifyUser, validation.createMessage, controller.sendMessage)
  .get(verifyUser, validation.getMessages, controller.getMessages)
  // .delete(async (req, res) => {
  //   await Message.deleteMany({})
  //   res.json('deleted')
  // })

export default router
