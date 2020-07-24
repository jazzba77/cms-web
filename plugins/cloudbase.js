import Vue from 'vue'
import Cloudbase from '@cloudbase/vue-provider'
import config from '../cloudbaserc'

const SERVICE_NAME = 'shop_cms_service'
const callFunction = async (data) => {
  try {
    const res = await Vue.prototype.$cloudbase.callFunction({
      name: SERVICE_NAME,
      data,
    })
    console.log('callFunction: ', data, res.result)
    return res.result
  } catch (err) {
    console.log('callFunction error: ', data, err)
  }
}

Vue.use(Cloudbase, {
  env: config.envId,
})

Vue.prototype.$callFunction = callFunction
Vue.prototype.$user = {}

console.log('cloudbase plugin')

try {
  const auth = Vue.prototype.$cloudbase.auth({ persistence: 'local' })
  if (!auth.hasLoginState()) {
    console.log('cloudbase login......')
    auth
      .anonymousAuthProvider()
      .signIn()
      .then(() => {
        console.log('cloudbase login success!')
      })
  }
} catch (err) {
  console.log('cloudbase login failed!', err)
}
