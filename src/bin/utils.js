const jwt = require('jsonwebtoken')

function createAccessToken (data, time = '30d') {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: time })
}

function getRequestToken (ctx) {
  return ctx.request.headers['x-token'] || ''
}

function verifyToken (ctx) {
  const rawToken = getRequestToken(ctx)
  return [jwt.verify(rawToken, process.env.JWT_SECRET), rawToken]
}

module.exports = { createAccessToken, getRequestToken, verifyToken }
