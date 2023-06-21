const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const hostname = '127.0.0.1';
const port = 3000;

var texts = `我爱你
我的家乡`
texts = texts.split('\n')

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/json; charset=utf-8');
  getText().then(textData => {
    res.end(textData);
  }).catch(error => {
    console.error(error.message);
    res.end(JSON.stringify([]));
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getMaoZeDongDataPromise(name) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database('maozedong.db');

    // run the query with a parameterized statement
    db.all("SELECT * FROM maozedong WHERE name=?", [name], function(err, rows) {
      if (err) {
        reject(err);
      }

      // print the results
      if (rows.length > 0) {
        data = JSON.parse(rows[0].data)
        console.log(data.co);
        resolve(data);
      } else {
        reject(new Error(`No data found for ${name}`));
      }

      // close the database connection
      db.close();
    });
  });
}

async function getText() {
  let result = [];
  for (let i = 0; i < texts.length; i++) {
    for (let j = 0; j < texts[i].length; j++) {
      var text = texts[i][j]
      console.log(text)
      try {
        let textData = await getMaoZeDongDataPromise(text);
        result.push(textData);
      } catch (error) {
        console.error(error.message);
      }
    }
  }
  return JSON.stringify(result);
}

