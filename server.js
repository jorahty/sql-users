const express = require("express");
const mysql = require("mysql");

// Create connection
let connection;
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "dt3bgg3gu6nqye5f.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "lnlmzf3s23emkicx",
    password: "m9854fcind6gx8el",
    database: "mj1wrfh4fy8udur3",
  });
}

// To delete a user:
// connection.query("DELETE FROM users WHERE id=3", (err, resultSet) => {
//   if (err) {
//     console.log('delete failed');
//     console.log('err: ', err);
//   } else {
//     console.log('delete attempted');
//   }
// });

const app = express();
const port = process.env.PORT || 3000;

// Home page
app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, resultSet) => {
    if (err) {
      return res.sendStatus(500);
    }
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Users Database</title>
        </head>
        <body>
          <h1>Users Database</h1>
          <input type="text" / >
          <button onclick="insert()">+</button>
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>email</th>
              </tr>
            </thead>
            <tbody>
            ${resultSet
              .map((user) => {
                return `
                  <tr>
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                  </tr>
                `;
              })
              .join("")}
            <tbody>
          </table>

          <script>
            function insert() {
              let input = document.querySelector('input');
              let root = window.location.href;
              let url = root + 'insert/' + input.value;

              httpGetAsync(url, done)
              input.value = null;
            }

            function httpGetAsync(theUrl, callback) {
              var xmlHttp = new XMLHttpRequest();
              xmlHttp.onreadystatechange = function() { 
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                  callback(xmlHttp.responseText);
              }
              xmlHttp.open("GET", theUrl, true); // true for asynchronous 
              xmlHttp.send(null);
            }

            function done() {
              location.reload();
            }
          </script>
        </body>
        </html>
        `;
    res.send(html);
  });
});

// Insert user
app.get("/insert/:user", (req, res) => {
  let user = req.params.user;

  if (user == null || user === '') return;

  connection.query(
    'INSERT INTO users (email) VALUES (?)',
    [`${user}@email.com`],
    (err, result) => {
      if (err) {
        console.log('insertion failed');
        console.log(err);
        return;
      }
      console.log('insertion attempted');
      res.send(`User "${user}" was inserted into the database! 👍`);
    }
  );
});

app.listen(port);
