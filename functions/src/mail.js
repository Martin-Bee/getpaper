const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const cors = require('cors')({ origin: true });

// pick which env file to use based off the environment
// export NODE_ENV=production or export NODE_ENV=devlopment
let path = 'dev.env';
if (process.env.NODE_ENV === 'production') {
  console.log('Using prod.env');
  path = 'prod.env';
}
require('dotenv').config({ path });

const senderEmail = 'GetPaper <feedback@getpaper.io>';

const mailTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Generate HTML email from a pug file
 * @param {*} filename
 * @param {*} options
 */
const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../emails/${filename}.pug`,
    options
  );
  const inlined = juice(html);
  return inlined;
};

/**
 * Send Email function
 * @param {*} options
 */
const sendEmail = (req, res, options = {}) => {
  const html = generateHTML(options.filename, options);
  const mailOptions = {
    from: senderEmail, // sender address
    to: options.to, // list of receivers
    subject: options.subject,
    html,
    text: htmlToText.fromString(html),
  };
  mailTransport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log(info);
      res.json(info);
    }
  });
};

exports.sendEmail = sendEmail;
