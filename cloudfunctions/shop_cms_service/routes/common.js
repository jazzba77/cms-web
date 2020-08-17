async function export2CSV(db, data) {
  const res = await db.collection(data.tablename).get()
  return res.data
}

async function import2Db(app, db, data) {
  const res = await app.downloadFile({
    fileID: data.fileID,
  })

  const lines = res.fileContent.toString().split('\n')
  lines.forEach((item, index) => {
    console.log('line ' + index, item)
  })
}

module.exports = {
  export2CSV,
  import2Db,
}
