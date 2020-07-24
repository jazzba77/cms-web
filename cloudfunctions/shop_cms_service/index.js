const TcbRouter = require('tcb-router')
const tcb = require('tcb-admin-node')

const app = tcb.init({
  env: 'ygapp-test-c1dj2',
})

const db = app.database()

exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  app.router('user/login', async (ctx, next) => {
    ctx.body = await require('./routes/user').login(db, event.data)
  })

  app.router('banner/get', async (ctx, next) => {
    ctx.body = await require('./routes/banner').get(db)
  })

  return app.serve()
}
