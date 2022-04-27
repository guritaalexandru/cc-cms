const connection = require("../db.js");
const mysql = require("mysql");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  connection.query("SELECT * FROM messages", (err, results) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      data: results,
    });
  });
});

router.post("/", (req, res) => {
  const { senderName, senderMail, receiverMail, messageContent } = req.body;

  const queryString = `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) VALUES (${mysql.escape(
    senderName
  )}, ${mysql.escape(senderMail)}, ${mysql.escape(
    receiverMail
  )}, ${mysql.escape(messageContent)})`;

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

module.exports = router;