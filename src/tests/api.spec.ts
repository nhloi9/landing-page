/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import 'mocha'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { type Express } from 'express'
import httpStatus from 'http-status'

import { server } from '../configs'
import database from '../database'

chai.use(chaiHttp)

describe('API testing', () => {
  let app: Express
  before(async function () {
    await database.connect()
    app = await server.initApp()
  })
  after(async function () {

  })
  it('health check', done => {
    void chai
      .request(app)
      .get('/alerts/v1/channels')
      .send()
      .end((err, res) => {
        expect(err).to.eq(null)
        expect(res).to.have.status(httpStatus.OK)
        done()
      })
  })
})
