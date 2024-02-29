import { Router } from 'express'

import { conversationControllers as controller } from '../../controllers'
import { verifyAdmin, verifyUser } from '../../middlewares'
import { conversationValidation as validation } from '../../validations'
// import { conversationRepo } from '../../repositories'

const router = Router()

router
  .route('/')
  .get(verifyUser, controller.userGetConversation)
  // .post(async (req, res) => {
  //   const body = { ...req.body, latestMsg: null }
  //   const convo = await conversationRepo.createConversation(body)
  //   return res.json(convo)
  // })

router
  .route('/list')
  .get(verifyAdmin, validation.getConversations, controller.adminGetConversations)

export default router
