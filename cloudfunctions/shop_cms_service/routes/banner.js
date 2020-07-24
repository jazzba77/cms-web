async function get(db) {
  const res = await db
    .collection('shop_banner')
    .where({ enabled: 1 })
    .orderBy('sort_order', 'asc')
    .get()
  return res.data
}

module.exports = {
  get,
}
