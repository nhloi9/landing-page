import {
  type WebSocket,
  type HttpRequest,
  type HttpResponse,
  type us_socket_context_t
} from 'uWebSockets.js'
import jwt from 'jsonwebtoken'
import { StringDecoder } from 'string_decoder'
import { v4 } from 'uuid'

import { accessTokenSettings } from '../configs'
import { connTypes, roles, socketMessages } from '../constants'
import { type IMessage } from '../types'
import { messageControllers } from '.'
import { conversationRepo } from '../repositories'

/**
 * @description each conversation has clients including user and admins (in multiple tabs)
 * @example
 * {
    admin_id: {
      session_id_1: ws, session_id_2: ws
    }
    convo_id_1: {
      session_id_1: ws, session_id_2: ws
    },
    convo_id_2: {
      session_id_1: ws
    }
  }
*/
const connections = new Map<string, Map<string, any>>()
const decoder = new StringDecoder('utf8')

export const upgradeFunc = async (
  res: HttpResponse,
  req: HttpRequest,
  context: us_socket_context_t
) => {
  try {
    const token = req.getQuery('authz')
    const payload = jwt.verify(token, accessTokenSettings.secret) as object
    let id, role
    if ('id' in payload && 'role' in payload) {
      id = payload.id as string
      role = payload.role as string
    }

    res.upgrade(
      { id, role }, // 1st argument sets which properties to pass to ws object
      req.getHeader('sec-websocket-key'),
      req.getHeader('sec-websocket-protocol'),
      req.getHeader('sec-websocket-extensions'), // 3 headers are used to setup websocket
      context // also used to setup websocket
    )
  } catch (error) {
    res.writeStatus('403 Invalid Access Token')
    res.end('WebSocket upgrade failed')
  }
}

export const openFunc = async (ws: WebSocket<unknown>) => {
  // retrieve data sent from upgrade event
  const data = ws.getUserData() as object

  if ('id' in data && 'role' in data) {
    const { id, role } = data
    const sessionId = v4()

    const convoId = await conversationRepo.getConversationIdByUserId(
      id as string
    )
    let connId: string

    role === roles.USER ? (connId = convoId) : (connId = connTypes.ADMIN)

    const conn = connections.get(connId)
    // if connection is existed
    if (conn !== undefined) {
      conn.set(sessionId, ws)
      // not existed
    } else {
      const newConn = new Map()
      newConn.set(sessionId, ws)
      connections.set(connId, newConn)
    }

    console.log(`[UWS] new connection client[${connId}]-[${sessionId}]`)
    console.log(connections)
  } else {
    ws.close()
  }
}

export const messageFunc = async (
  ws: WebSocket<unknown>,
  message: ArrayBuffer,
  _isBinary: boolean
) => {
  try {
    const data = ws.getUserData() as object
    const plainMsg: IMessage = JSON.parse(decoder.write(Buffer.from(message)))
    // plainMsg: { conversationId, content }

    if ('id' in data && 'role' in data) {
      const sender = data.role as string
      const connIdOfConvo = plainMsg.conversationId
      const connIdOfAdmin = connTypes.ADMIN

      const result = await messageControllers.saveSocketMessage(ws, {
        ...plainMsg,
        sender
      })

      sendSocketMessage(
        ws,
        sender,
        connIdOfConvo,
        connIdOfAdmin,
        result?.newMessage,
        result?.updatedConvo
      )
    }
  } catch (error) {
    ws.close()
  }
}

const sendSocketMessage = (
  ws: WebSocket<unknown>,
  sender: string,
  connIdOfConvo: string,
  connIdOfAdmin: string,
  newMessage: IMessage | undefined,
  updatedConvo: object | undefined
) => {
  const msg = {
    msgType: socketMessages.MESSAGE,
    content: newMessage
  }

  // send to convoOfUser/admin
  let conn = connections.get(
    sender === roles.USER ? connIdOfAdmin : connIdOfConvo
  )
  if (conn !== undefined) {
    conn.forEach((session, _key, _map) => {
      session.send(JSON.stringify(msg))
    })
  }
  // send to other sessions
  conn = connections.get(sender === roles.USER ? connIdOfConvo : connIdOfAdmin)
  if (conn !== undefined) {
    conn.forEach((session, _key, _map) => {
      if (session !== ws) {
        session.send(JSON.stringify(msg))
      }
    })
  }
  // update list of conversations
  sendUpdatedConvo(
    socketMessages.LATEST_MSG,
    connIdOfConvo,
    connIdOfAdmin,
    updatedConvo
  )
}

export const sendUpdatedConvo = (
  messageType: string,
  connIdOfConvo: string,
  connIdOfAdmin: string,
  updatedConvo: object | undefined
) => {
  const convoMsg = {
    msgType: messageType,
    content: updatedConvo
  }
  // send updated convo to admin's convo list
  let conn = connections.get(connIdOfAdmin)
  if (conn !== undefined) {
    conn.forEach((session, _key, _map) => {
      session.send(JSON.stringify(convoMsg))
    })
  }
  // send updated convo to user's convo
  conn = connections.get(connIdOfConvo)
  if (conn !== undefined) {
    conn.forEach((session, _key, _map) => {
      session.send(JSON.stringify(convoMsg))
    })
  }
}

export const closeFunc = async (ws: WebSocket<unknown>) => {
  const data = ws.getUserData() as object

  if ('id' in data && 'role' in data) {
    const { id, role } = data
    const convoId = await conversationRepo.getConversationIdByUserId(
      id as string
    )
    let connId: string

    role === roles.USER ? (connId = convoId) : (connId = connTypes.ADMIN)
    const conn = connections.get(connId)

    conn?.forEach((value, key, _map) => {
      if (value === ws) {
        conn.delete(key)
        console.log(`[UWS] connection client[${connId}]-[${key}] closed`)
      }
    })
  }
}
