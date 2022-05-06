const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const dotenv = require("dotenv");
dotenv.config();

const sendMail = async (receiver, sender, subject, msg) => {
  const msgToSend = {
    to: receiver,
    from: sender,
    subject: subject,
    text: msg,
    //html: "...",
  };

  try {
    let sendMailResponse = await sgMail.send(msgToSend);
    console.log(sendMailResponse);
    return sendMailResponse[0].statusCode;
  }
  catch (err) {
    console.log(err);
    return 400;
  }
};

module.exports = {
  sendMail,
}