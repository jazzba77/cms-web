import utils from '~/utils/utils'

export default function ({ route, store, req, res, redirect }) {
  if (route.path === '/login') return

  const isClient = process.client
  const isServer = process.server
  let token

  if (isServer) {
    const cookies = utils.getCookiesInServer(req)
    token = cookies.token ? cookies.token : ''
  }

  if (isClient) {
    token = utils.getCookiesInClient('token')
  }

  if (!token) {
    redirect('/login')
  } else {
    !store.state.user && store.commit('setUser', JSON.parse(token))
  }
}
