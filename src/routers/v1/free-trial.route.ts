import { Router } from 'express'

import { freeTrialControllers as controller } from '../../controllers'
import { freeTrialValidation as validationFreeTrial } from '../../validations'

const router = Router()
router.route('/').post(validationFreeTrial.freeTrial, controller.freeTrial)
export default router
