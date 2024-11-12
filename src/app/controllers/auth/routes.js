const Router = require('@koa/router')
const { auth } = require('../../middlewares')

const login = require('./login')
const logout = require('./logout')

const route = new Router()

// @ts-ignore
route.post('/login', login)
route.get('/logout', auth(), logout)

module.exports = route
