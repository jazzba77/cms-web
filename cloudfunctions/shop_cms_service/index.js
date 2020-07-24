const TcbRouter = require('tcb-router')
const tcb = require('tcb-admin-node')
const User = require('./routes/user')

const app = tcb.init({
  env: 'ygapp-test-c1dj2',
})

const db = app.database()

exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  app.router('user/login', async (ctx, next) => {
    ctx.body = await User.login(db, event.data)
  })

  return app.serve()
}
