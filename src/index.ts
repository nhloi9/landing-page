import database from './database'
import { server, socketServer } from './configs'
import * as scripts from './scripts'

database
  .connect()
  .then(_connected => {
    scripts.run()
    void server.initApp()
  })
  .catch(error => {
    console.error(error)
  })

const socket = socketServer.start()

export default { socket }
