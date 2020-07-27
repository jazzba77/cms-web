import Cookie from 'js-cookie'

/* 函数节流 */
function throttle(fn, interval) {
  let enterTime = 0 // 触发的时间
  const gapTime = interval || 300 // 间隔时间，如果interval不传，则默认300ms
  return function () {
    const context = this
    const backTime = new Date() // 第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments)
      enterTime = backTime // 赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  }
}

/* 函数防抖 */
function debounce(fn, interval) {
  let timer
  const gapTime = interval || 500 // 间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer)
    const context = this
    const args = arguments // 保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args)
    }, gapTime)
  }
}

function getUID() {
  // 通过时间戳拼接 格式化时间
  const date = new Date(new Date().getTime())
  const YYYY = date.getFullYear()
  let MM = date.getMonth() + 1
  let DD = date.getDate()
  let HH = date.getHours()
  let mm = date.getMinutes()
  let ss = date.getSeconds()
  let ms = date.getMilliseconds()

  MM = MM < 10 ? '0' + MM : MM
  DD = DD < 10 ? '0' + DD : DD
  HH = HH < 10 ? '0' + HH : HH
  mm = mm < 10 ? '0' + mm : mm
  ss = ss < 10 ? '0' + ss : ss
  ms = ms < 10 ? '00' + ms : ms < 100 ? '0' + ms : ms

  return (
    '' +
    YYYY +
    MM +
    DD +
    HH +
    mm +
    ss +
    ms +
    Math.round(Math.random().toFixed(4) * 10000)
  )
}

// 获取服务端cookie
function getCookiesInServer(req) {
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
}

// 获取客户端cookie
function getCookiesInClient(key) {
  return Cookie.get(key) ? Cookie.get(key) : ''
}

export default {
  throttle,
  debounce,
  getUID,
  getCookiesInServer,
  getCookiesInClient,
}
