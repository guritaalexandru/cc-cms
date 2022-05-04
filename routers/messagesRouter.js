const connection = require("../db.js");
const mysql = require("mysql");
const express = require("express");
const { detectLanguage, translateText, } = require("../utils/translateFunctions.js");
const { LANGUAGE_ISO_CODE } = require("../utils/dictionaries.js");
const { sendMail } = require("../utils/mailFunctions.js");

const buildInsertQueryString = (senderName, senderMail, receiverMail, messageContent) => {
    const queryString = `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) 
        VALUES (${mysql.escape(senderName)}, ${mysql.escape(senderMail)}, ${mysql.escape(receiverMail)}, ${mysql.escape(messageContent)})`;
    return queryString;
};

const router = express.Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM messages", (err, results) => {
        if (err) {
            return res.send(err);
        }

        return res.json({
            messages: results,
        });
    });
});

router.post("/", (req, res) => {
    const { senderName, senderMail, receiverMail, messageContent } = req.body;
    if (!senderName || !senderMail || !receiverMail || !messageContent) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const queryString = buildInsertQueryString(senderName, senderMail, receiverMail, messageContent);

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

// ...

router.post("/foreign", async (req, res) => {
    const { senderName, senderMail, receiverMail, messageContent, language } = req.body;
    if (!senderName || !senderMail || !receiverMail || !messageContent || !language) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    let translationData = {};

    const queryString = buildInsertQueryString(senderName, senderMail, receiverMail, messageContent);

    try {
        //Translate the message in one or more languages
        if (language === "ALL") {
            const originalLanguageResponse = await detectLanguage(messageContent);
            translationData.originalLanguage = originalLanguageResponse[0]?.language;
            const availableLanguages = Object.values(LANGUAGE_ISO_CODE);

            const translatedAnswersArray = await Promise.all(
                availableLanguages.map(async (language) => {
                    const translatedTextResponse = await translateText(messageContent, language);
                    return translatedTextResponse[0];
                })
            );
            translationData.translatedText = translatedAnswersArray.reduce(
                (acc, curr) => {
                    return acc + curr + "\n";
                },
                ""
            );
        }
        else if (LANGUAGE_ISO_CODE[language]) {
            const originalLanguageResponse = await detectLanguage(messageContent);
            translationData.originalLanguage = originalLanguageResponse[0]?.language;

            const translatedTextResponse = await translateText(
                messageContent,
                LANGUAGE_ISO_CODE[language]
            );
            translationData.translatedText = translatedTextResponse[0];
        }
        else {
            return res.send("Language not supported");
        }

        //Send the message through the mail service
        const sendMailResponse = await sendMail(
            receiverMail,
            senderMail,
            senderName + "" + " sent you a message",
            translationData.translatedText
        );

        // Store original message in database
        connection.query(queryString, (err, results) => {
            if (err) {
                return res.send(err);
            }

            return res.json({
                translationData,
            });
        });
    } catch (err) {
        console.log(err);
        return res.send("Something went wrong");
    }
});

module.exports = router;
