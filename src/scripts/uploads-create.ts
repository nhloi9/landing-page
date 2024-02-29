import fs from 'fs'

export const createUploadsFolder = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}
