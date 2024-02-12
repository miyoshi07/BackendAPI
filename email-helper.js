const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.host,
  port: process.env.port,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

const sendEmail = async (emailBody) => {

  let emailResult;
  if (emailBody.isHtml) {
    emailResult = await transporter.sendMail({
      from: '"E Commerce API" <ecommerceapilibunaofausto@gmail.com>',
      to: emailBody.to, 
      subject: emailBody.subject,
      html: emailBody.message,
    });
  } else {
    emailResult = await transporter.sendMail({
      from: '"E Commerce API" <ecommerceapilibunaofausto@gmail.com>',
      to: emailBody.to, 
      subject: emailBody.subject,
      text: emailBody.message
    });
  }

  return emailResult;
}

module.exports = { sendEmail };
