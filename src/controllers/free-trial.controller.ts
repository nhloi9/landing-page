import { type Request, type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'
import { v4 } from 'uuid'

import { freeTrialRepo } from '../repositories'
import { getApiResponse } from '../utils'
import { freeTrialMailer } from '../mailer'
import { messages } from '../constants'

// Dùng thử
export const freeTrial = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lưu User vào database
    await freeTrialRepo.createFreeTrial({ id: v4(), ...req.body })

    // Gửi mail
    void freeTrialMailer.sendFreeTrialEmail({
      ...req.body
    })
    return res
      .status(httpStatus.OK)
      .json(getApiResponse(messages.USER_SENT_REQUEST_TO_MAIL))
  } catch (error) {
    next(error)
  }
}
