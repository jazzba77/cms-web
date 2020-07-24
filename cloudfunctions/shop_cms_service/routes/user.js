async function login(db, data) {
  const conditon = { username: data.username, password: data.password }
  const res = await db.collection('cms_user').where(conditon).get()
  let user = null
  if (res.data.length > 0) {
    user = res.data[0]
    delete user.password
  }
  return user
}

module.exports = {
  login,
}
