const { Models } = require('../../../bin/db')
const bcrypt = require('bcrypt')
const { createAccessToken } = require('../../../bin/utils')

async function login (ctx) {
  const { request } = ctx
  await ctx.validate({
    email: 'email|required',
    password: 'required|string'
  })

  const user = await Models().User.findOne({ email: request.body.email })

  if (!user) {
    ctx.throw(404, { message: 'User not found' })
  }
  const match = await bcrypt.compare(request.body.password, user.password)
  if (!match) {
    ctx.throw(406, { message: 'Incorrect password.' })
  }

  const token = createAccessToken({_id:user._id, email:user.email});

  ctx.body = { token, message: 'Login success.' }
}
module.exports = login
