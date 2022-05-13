const express = require("express");
const mysql = require("mysql");

// Create connection
let connection;
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  console.log('connection failed');
}

// To delete a user:
// connection.query("DELETE FROM users WHERE id=28", (err, resultSet) => {
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
          <title>Users</title>
        </head>
        <body>
          <h1>Users</h1>
          <input placeholder="new user" type="text" / >
          <button onclick="insert()">Add</button>
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

              if (input.value == null || input.value === '') return;

              let confirmed = confirm(input.value + ' will be added to the database.');

              if (confirmed == false) return;

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

          <style>
            html {
              background: #282c34;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, Roboto, 'Open Sans', 'Helvetica Neue', sans-serif;
              background: #20232a;
              color: #bbb;
              width: 360px;
              margin: 80px auto;
              padding: 50px;
              border-radius: 20px;
            }

            h1 {
              color: #6353dd;
              margin: 0;
              margin-bottom: 30px;
            }

            input, button {
              border: none;
              line-height: 1;
              border-radius: 25px;
            }

            input {
              font-family: -apple-system, BlinkMacSystemFont, Roboto, 'Open Sans', 'Helvetica Neue', sans-serif;
              background: #ffffff0d;
              color: #bbb;
              padding: 10px 20px;
            }

            input:focus {
              outline: none;
            }

            button {
              background: #6353dd;
              font-weight: 900;
              cursor: pointer;
              padding: 10px 15px;
              margin-left: 10px;
              color: #20232a;
            }

            table {
              margin-top: 30px;
              color: #888;
            }

            td {
              padding: 3px 20px;
            }
          </style>
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
