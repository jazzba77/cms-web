import Vue from 'vue'
import Cloudbase from '@cloudbase/vue-provider'
import config from '../cloudbaserc'
import utils from '../utils/utils'

const SERVICE_NAME = 'shop_cms_service'
const callFunction = async (data) => {
  try {
    const res = await Vue.prototype.$cloudbase.callFunction({
      name: SERVICE_NAME,
      data,
      parse: true,
    })
    console.dir('callFunction: ', data, res.result)
    return res.result
  } catch (err) {
    console.log('callFunction error: ', data, err)
  }
}

const uploadFile = (file, dir) => {
  return Vue.prototype.$cloudbase
    .uploadFile({
      cloudPath:
        dir + '/' + utils.getUID() + '.' + file.file.type.split('/')[1],
      filePath: file.file,
    })
    .then((res) => {
      console.log('uploadFile success: ', res)
      return res
    })
    .catch((err) => {
      console.log('uploadFile failed: ', err)
      return err
    })
}

const deleteFile = (fileList) => {
  return Vue.prototype.$cloudbase
    .deleteFile({
      fileList,
    })
    .then((res) => {
      res.fileList.forEach((el) => {
        if (el.code === 'SUCCESS') {
          // 删除成功
          console.log('deleteFile success: ', el.fileID)
        } else {
          console.log('deleteFile failed: ', el.code)
        }
      })
    })
}

Vue.use(Cloudbase, {
  env: config.envId,
})

Vue.prototype.$callFunction = callFunction
Vue.prototype.$uploadFile = uploadFile
Vue.prototype.$deleteFile = deleteFile
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
