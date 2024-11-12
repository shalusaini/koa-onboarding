const http = require('http')
const Koa = require('koa')
const logger = require('koa-logger')
const { koaBody } = require('koa-body')
const niv = require('node-input-validator')
const { connect, client } = require('./db')
const cors = require('./cors')
const router = require('./router')

// create applciation
const app = new Koa({
  proxy: true
})

app.use(async (ctx, next) => {
  try {
    // Set page limit
    ctx.limit = 80
    await next()
  } catch (e) {
    console.error(e)
    ctx.type = e.type || 'application/json'
    ctx.status = e.status || 500
    const body = {
      error: ctx.status >= 500 ? 'Something went wrong' : e.message
    }

    if (e.meta) {
      body.meta = e.meta
    }

    ctx.body = body
  }
})

// attach logger
app.use(logger())
// cors
app.use(cors())
// NIV
app.use(niv.koa())

// @ts-ignore
app.context.reply = function reply (data, { meta, message } = {}) {
  this.body = { data, message, meta }
}

app.use(
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true
    }
  })
)

router(app)
connect()
  .then(v => {
    app.server = http.createServer(app.callback())
    app.server.listen(process.env.PORT)
    console.log(`server connected successfully at  port ${process.env.PORT}`)
  })
  .catch(error => {
    process.exit(1)
  })
