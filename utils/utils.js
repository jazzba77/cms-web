import Cookie from 'js-cookie'
export default {
  // 获取服务端cookie
  getCookiesInServer(req) {
    const cookies = {}
    req &&
      req.headers.cookie &&
      decodeURIComponent(req.headers.cookie)
        .split(';')
        .forEach(function (val) {
          const parts = val.split('=')
          cookies[parts[0].trim()] = (parts[1] || '').trim()
        })
    return cookies
  },
  // 获取客户端cookie
  getCookiesInClient(key) {
    return Cookie.get(key) ? Cookie.get(key) : ''
  },
}
