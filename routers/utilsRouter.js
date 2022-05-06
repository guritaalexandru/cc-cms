const express = require("express");
const { detectLanguage, translateText, } = require("../utils/translateFunctions.js");
const { LANGUAGE_ISO_CODE } = require("../utils/dictionaries.js");
const { sendMail } = require("../utils/mailFunctions.js");

const router = express.Router();

// create a get route that detects the language of a text from request body
router.get("/detect", async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const languageDetection = await detectLanguage(text);
    console.log(languageDetection);
    return res.json({
        language: languageDetection[0]?.language,
    });
}
);

//create a get route that translates a text from request body
router.get("/translate", async (req, res) => {
    const { text, language } = req.body;
    if (!text || !language) {
        return res.status(400).send("Bad request. Missing parametres.");
    }
    if(!LANGUAGE_ISO_CODE[language]) {
        return res.status(400).send("Bad request. Language not supported.");
    }
    // const translatedText = await translateText(text, LANGUAGE_ISO_CODE[language]);
    const translatedText = await translateText(text, LANGUAGE_ISO_CODE[language]);
    console.log(translatedText);
    return res.json({
        translatedText: translatedText[0],
    });
}
);

//create a get route that sends an email from request body
router.post("/send", async (req, res) => {
    const { senderName, senderMail, receiverMail, messageContent } = req.body;
    if (!senderName || !receiverMail || !messageContent || !senderMail) {
        return res.status(400).send("Bad request. Missing parametres.");
    }
    //receiver, sender, subject, msg
    const mailSentResponseCode = await sendMail(receiverMail, senderMail, "You've got a message!", messageContent);
    return res.json({
        responseCode: mailSentResponseCode,
    });
});

module.exports = router;
