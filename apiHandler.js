const sqlite3 = require('sqlite3').verbose();

async function getData(db, tableParam, nameParam) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableParam} WHERE name = ?`;
    db.get(query, [nameParam], (err, row) => {
      if (err) {
        console.error(err.message);
        reject('Failed to execute the query.');
        return;
      }

      if (!row || typeof row.data === 'undefined') {
        resolve({});
        return;
      }

      try {
        const jsondb = JSON.parse(row.data);
        resolve(jsondb);
      } catch (error) {
        console.error(error.message);
        reject('Failed to parse data as JSON.');
      }
    });
  });
}


async function handleAPIRequest(req, res) {
  const postData = req.body;
  const dbParam = `${postData.db}.db`;
  const tableParam = postData.dbTable;
  const nameParam = postData.dbName;

  console.log(postData)

  const textLine = nameParam.split('\n')

  for (let index = 0; index < textLine.length; index++) {
    const element = textLine[index];
    console.log(element.length)

  }



  // const linesTexts = nameParam.split('\n')
  //   .filter(line => line.trim() !== '');

  const linesTexts = nameParam.split('\n')


  const dbdatas = [];
  const db = new sqlite3.Database(dbParam, sqlite3.OPEN_READWRITE, async (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to connect to the database.' });
      return;
    }
    for (const texts of linesTexts) {
      if (texts.length == 0) {
        dbdatas.push([])
      } else {

        const linedb = [];
        for (const name of texts.trim()) {
          try {
            const data = await getData(db, tableParam, name.trim());
            // console.log(`Got data for ${name}:`, data);
            linedb.push(data);
          } catch (error) {
            console.error(error.message);
            linedb.push({});
          }

        }
        dbdatas.push(linedb);
      }
    }

    res.json(dbdatas);
    db.close();
  });
}

module.exports = handleAPIRequest;
