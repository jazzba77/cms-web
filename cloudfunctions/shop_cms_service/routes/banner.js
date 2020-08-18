async function getEnabled(db) {
  const res = await db
    .collection('shop_banner')
    .where({ is_delete: 0, enabled: 1 })
    .orderBy('sort_order', 'asc')
    .get()

  return res.data.map((item) => item.img_url)
}

async function get(db, data) {
  const _ = db.command

  const condition1 = {
    is_delete: 0,
  }

  const condition2 = {
    is_delete: 0,
  }

  if (data.keyword) {
    condition1.title = new db.RegExp({ regexp: data.keyword })
    condition2.remark = new db.RegExp({ regexp: data.keyword })
  }

  // if (data.pageSize && data.currentPage) {
  const p1 = db
    .collection('shop_banner')
    .where(_.or([condition1, condition2]))
    .count()

  const p2 = db
    .collection('shop_banner')
    .skip((data.currentPage - 1) * data.pageSize)
    .limit(data.pageSize)
    .where(_.or([condition1, condition2]))
    .orderBy('sort_order', 'asc')
    .get()

  const res = await Promise.all([p1, p2])
  // console.log('res', res)
  return { total: res[0].total, data: res[1].data }
  // } else {
  // const res = await db
  //   .collection('shop_banner')
  //   .where(_.or([condition1, condition2]))
  //   .orderBy('sort_order', 'asc')
  //   .get()
  // return res.data
  // }
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
  getEnabled,
  update,
  add,
  remove,
}
