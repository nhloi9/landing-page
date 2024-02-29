import { createUploadsFolder } from './uploads-create'

export const run = (): void => {
  createUploadsFolder('uploads')
}
