'use strict'

/* global describe, it */
const expect = require('chai').expect
const request = require('supertest')

describe('Smoke - Config files', () => {
  let server

  it('should successfully start server', async () => {
    const { server: service, port } = require('../server')()

    server = await service.start(port)
  })

  it('should GET index.html', async () => {
    await request(server)
      .get('/')
      .expect(200)
      .then((res) => {
        expect(res.text).to.equal('<h1>Hello from restana-static!</h1>')
        expect(res.headers['cache-control']).to.equal('public, no-cache, max-age=604800')
      })
  })

  it('should successfully terminate the server', async () => {
    await server.close()
  })
})
