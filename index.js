const express = require("express");
const messagesRouter = require("./routers/messagesRouter");
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
const cors = require('cors');

const app = express();
app.use(cors())

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.use('/messages', messagesRouter);

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

// const {detectLanguage, translateText} = require("./utils/translateFunctions.js");
// const {LANGUAGE_ISO_CODE} = require("./utils/dictionaries.js");

// const processLanguage = async (text) => {
//   const languageDetection = await detectLanguage(text);
//   const translatedText = await translateText(text, LANGUAGE_ISO_CODE.ROMANIAN);
//   console.log(languageDetection);
//   console.log(translatedText);
// }

// processLanguage("Hello world! This is my first time using Google Translate API!");
// const {sendMail} = require("./utils/mailFunctions.js");
// sendMail("alexandru.gurita@gdm.ro", "alexandru.gurita@gdm.ro", "Test", "TestMessage");
