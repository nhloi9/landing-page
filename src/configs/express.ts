import express, { type Express, type Request, type Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import timeout from 'connect-timeout'
import methodOverride from 'method-override'
import morgan from 'morgan'

import { vars } from './vars'
import routerV1 from '../routers/v1'
import { notFound, errorConverter } from '../middlewares'
import path from 'path'

const haltOnTimedout = (req: Request, _res: Response, next: any): void => {
  if (!req.timedout) {
    next()
  }
}

export const initApp = async (): Promise<Express> => {
  const app = express()
  app.use(timeout('5s'))
  app.use(morgan('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(methodOverride())
  app.use(helmet())
  app.use(cors())

  app.use('/static', express.static('uploads'))

  app.get('/health', (_req: Request, res: Response) => {
    res.send('OK')
  })
  app.use('/landing-pages/v1', routerV1)
  app.use('/static', express.static(path.join(__dirname, 'public')))
  app.use(notFound)
  app.use(haltOnTimedout)
  app.use(errorConverter)
  app.listen(vars.port, () => {
    console.info(`[server] listen on port ${vars.port}`)
  })
  return app
}
