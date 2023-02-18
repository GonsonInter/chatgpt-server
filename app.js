import Koa from 'koa'
import views from 'koa-views'
import json from 'koa-json'
import onerror from 'koa-onerror'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import koaStatic from 'koa-static'
import path from "path"

import chatRouter from './routes/chat.js'
import wechatRouter from './routes/wechat.js'

const app = new Koa()

const __dirname = path.resolve();


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(koaStatic(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(chatRouter.routes(), chatRouter.allowedMethods())
app.use(wechatRouter.routes(), wechatRouter.allowedMethods())

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.app.emit('error', err, ctx);
  }
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

export default app
