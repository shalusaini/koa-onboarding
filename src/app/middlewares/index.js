const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const { Models } = require('../../bin/db')

function getHeaderToken (ctx) {
  return ctx.request.headers['x-token'] || ''
}

function verifyToken (ctx) {
  const rawToken = getHeaderToken(ctx);
  return [jwt.verify(rawToken,process.env.JWT_SECRET), rawToken]
}

async function authorize (ctx, next, { token, rawToken }) {
  const query = {
    _id: new ObjectId(token._id),
    email: token.email
  }

   const [user, blocked] = await Promise.all([
    Models().User.findOne(query),
    Models().BlockAccess.findOne({ token: rawToken })
  ])

  if (!user || blocked) {
    ctx.throw(401, { message: 'ACCESS_TOKEN_EXPIRED' })
    return
  }

  ctx.user = user
  ctx.token = token

  await next()
}

function auth () {
  return async (ctx, next) => {
    let token,rawToken;
    try {
      [token, rawToken] = verifyToken(ctx)
    } catch (e) {
      console.log(e)
      ctx.throw(401, { message: 'ACCESS_TOKEN_INAVLID' })
      return
    }
    await authorize(ctx, next, { token, rawToken })
  }
}


module.exports = { auth }
