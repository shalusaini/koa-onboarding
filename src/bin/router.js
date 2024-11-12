/* eslint-disable no-console */
const Router = require('@koa/router')
const { glob } = require('glob')
const path = require('path')

module.exports = async app => {
  const router = new Router()

  router.get('/', async ctx => {
    ctx.body = {
      name: 'welcome to koa-onboarding' || process.env.APP_NAME,
      ip: ctx.request.ip
    }
  })

  console.info('Creating routes...')
  const files = await glob(
    path.join(__dirname, '../app/controllers/**/routes.js')
  )
 
  files.forEach(file => {
    console.info(`Adding routes ${file}`)
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const routes = require(file)
    if (routes instanceof Router) {
      router.use(routes.routes(), routes.allowedMethods())
    }
  })

  console.info('Routes created.')
  app.use(router.routes()).use(router.allowedMethods({ throw: true }))
}
