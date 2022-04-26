const express = require("express");
const connection = require("./db.js");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();

const app = express();
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

app.get("/messages", (req, res) => {
  connection.query("SELECT * FROM messages", (err, results) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      data: results,
    });
  });
});

app.post("/messages", (req, res) => {
  const {
    senderName,
    senderMail,
    receiverMail,
    messageContent
  } = req.body;

  const queryString = `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) VALUES (${mysql.escape(senderName)}, ${mysql.escape(senderMail)}, ${mysql.escape(receiverMail)}, ${mysql.escape(messageContent)})`;

  connection.query(queryString, (err, results) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      data: results,
    });
  });
});

// TODO: Add rest of routes