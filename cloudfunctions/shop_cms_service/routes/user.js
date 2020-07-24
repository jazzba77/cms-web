async function login(db, data) {
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&& data', data)
  const conditon = { username: data.username, password: data.password }
  const res = await db.collection('cms_user').where(conditon).get()
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&& res', res)
  let user = null
  if (res.data.length > 0) {
    user = res.data[0]
    delete user.password
  }
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&& res', user)
  return user
}

module.exports = {
  login,
}
