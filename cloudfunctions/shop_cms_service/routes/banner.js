async function get(db) {
  const res = await db
    .collection('shop_banner')
    .where({ is_delete: 0 })
    .orderBy('sort_order', 'asc')
    .get()
  return res.data
}

async function update(db, data) {
  const condition = {
    _id: data._id,
  }

  delete data._id

  data.updtime = Date.now()

  const newVal = { ...data }

  console.log('shop_banner update ', condition, newVal)
  const res = await db.collection('shop_banner').where(condition).update(newVal)
  return res
}

async function remove(db, data) {
  const _ = db.command

  const condition = {
    _id: _.in(data.ids),
  }

  data.updtime = Date.now()

  const newVal = { is_delete: 1 }

  console.log('shop_banner remove ', condition, newVal)
  const res = await db.collection('shop_banner').where(condition).update(newVal)
  return res
}

async function add(db, data) {
  data.updtime = Date.now()
  const res = await db.collection('shop_banner').add(data)
  console.log('shop_banner add ', data, res)
  return res
}

module.exports = {
  get,
  update,
  add,
  remove,
}
