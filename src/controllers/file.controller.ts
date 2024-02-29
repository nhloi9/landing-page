import { type Request, type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'
import fs from 'fs'

import { getApiResponse } from '../utils'
import { messages } from '../constants'

export const uploadFile = (req: Request, res: Response) => {
  res
    .status(httpStatus.OK)
    .json(getApiResponse({ data: { fileName: req.file?.filename } }))
}

export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    fs.unlink('uploads/' + req.params.fileName, (err: any) => {
      if (err !== null) {
        if (err.code === 'ENOENT') {
          res
            .status(httpStatus.NOT_FOUND)
            .json(getApiResponse(messages.FILE_NOT_FOUND))
        } else next(err)
      } else {
        return res
          .status(httpStatus.OK)
          .json(getApiResponse(messages.FILE_DELETED_SUCCESS))
      }
    })
  } catch (error) {
    next(error)
  }
}
