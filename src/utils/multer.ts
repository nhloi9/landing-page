import multer, { type FileFilterCallback } from 'multer'
import { type Request } from 'express'
import { fileValidation } from '../constants'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.floor(Math.random() * 1e9).toString(36)
    const fileNames = file.originalname.split('.')
    const validName = fileNames[0]
      .toLowerCase()
      .replace(/[^a-z0-9-_\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50)
    cb(
      null,
      validName + '_' + uniqueSuffix + '.' + fileNames[fileNames.length - 1]
    )
  }
})
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (fileValidation.fileTypesAccepted.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('multer'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: fileValidation.fileMaxSize
  }
})
