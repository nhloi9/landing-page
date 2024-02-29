import { Router } from 'express'

import userRouters from './user.route'
import freeTrialRouters from './free-trial.route'
import resourceRouters from './resource.route'
import fileRouters from './file.route'
import commentRouters from './comment.route'
import messageRouters from './message.route'
import conversationRouters from './conversation.route'

const router = Router()

router.use('/users', userRouters)
router.use('/free-trial', freeTrialRouters)
router.use('/resources', resourceRouters)
router.use('/files', fileRouters)
router.use('/comments', commentRouters)
router.use('/messages', messageRouters)
router.use('/conversations', conversationRouters)

export default router
