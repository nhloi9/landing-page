import { DEDICATED_COMPRESSOR_3KB, type TemplatedApp } from 'uWebSockets.js'
import httpStatus from 'http-status'

import { socketControllers } from '../../controllers'
import { messages } from '../../constants'

const uwsRoutes = (server: TemplatedApp): any => {
  server
    .ws('/landing-pages/chatting', {
      compression: DEDICATED_COMPRESSOR_3KB,
      idleTimeout: 0,
      upgrade: socketControllers.upgradeFunc,
      open: socketControllers.openFunc,
      message: socketControllers.messageFunc,
      close: socketControllers.closeFunc
    })
    .any('/*', (res, _req) => {
      res
        .writeStatus(httpStatus.NOT_FOUND.toString())
        .writeHeader('Content-Type', 'application/json; charset=utf-8')
        .end(JSON.stringify(messages.NOT_FOUND))
    })
}

export default uwsRoutes
