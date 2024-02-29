import uWS from 'uWebSockets.js'

import socketRouter from '../routers/v1/socket.route'
import { vars } from './vars'

const uws = uWS.App()

export const start = (): uWS.TemplatedApp => {
  socketRouter(uws)
  uws.listen(vars.socketPort as number, () => {
    console.info(`[socket] listen on port ${vars.socketPort}`)
  })
  return uws
}
