const moment = require('moment')
const { Models } = require('../../../bin/db')

module.exports = async function logout (ctx) {
  await Models().BlockAccess.insertOne({
    token: ctx.request.headers['x-token'],
    expiry: moment.unix(ctx.token.exp),
    issuedAt: moment.unix(ctx.token.iat)
  })
  ctx.body = { message: 'logout Successfully' }
}
