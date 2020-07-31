import utils from '~/utils/utils'

export default function ({ route, store, req, redirect }) {
  if (route.path === '/login') return

  const token = utils.getCookies(req, 'token')

  if (!token) {
    redirect('/login')
  } else {
    !store.state.user && store.commit('setUser', JSON.parse(token))
  }
}
