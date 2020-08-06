function get(db, data) {
  const condition = {
    is_delete: 0,
    is_on_sale: 1,
  }

  if (data.name) {
    condition.name = data.name
  }

  return new Promise((resolve, reject) => {
    db.collection('shop_goods')
      .skip((data.currentPage - 1) * data.pageSize)
      .limit(data.pageSize)
      .where(condition)
      .orderBy('name', 'asc')
      .get()
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = {
  get,
}
