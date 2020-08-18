async function export2CSV(db, data) {
  const res = await db.collection(data.tablename).get()
  return res.data
}

async function import2Db(app, db, data) {
  try {
    const file = await app.downloadFile({
      fileID: data.fileID,
    })

    const parse = require('csv-parse/lib/sync')

    const records = parse(file.fileContent, {
      bom: true,
      columns: true,
      cast(value, context) {
        if (['is_delete', 'enabled', 'sort_order'].includes(context.column)) {
          return parseInt(value)
        } else {
          return value
        }
      },
    })

    if (records.length > 0) {
      const transaction = await db.startTransaction()
      if (data.importType === '1') {
        const curRes = await transaction.collection(data.tableName).get()
        for (const doc of curRes.data) {
          await transaction.collection(data.tableName).doc(doc._id).delete()
        }
      }

      const newRes = await transaction.collection(data.tableName).add(records)
      await transaction.commit()
      return { imported: newRes.ids.length || 0 }
    } else {
      return { imported: 0 }
    }
  } catch (err) {
    return err
  }
}

module.exports = {
  export2CSV,
  import2Db,
}
