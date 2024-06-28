const nodemailer = require('nodemailer');
const ejs = require('ejs');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch((err) => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} message
 * @param {string} name
 * @param {string} url
 * @returns {Promise}
 */
const sendEmail = async (to, subject, message, name, url = null) => {
  ejs.renderFile(
    'src/services/email-template/email.html',
    {
      name,
      url,
      subject,
      message,
    },
    (err, html) => {
      if (!err) {
        const mailOptions = {
          from: `${config.email.from} <${config.email.from}>`,
          to: `${to} <${to}>`,
          subject,
          html,
        };
        transport.sendMail(mailOptions, (err,data) => {
            console.log("Response email",data)
            console.log("Error ----------- ", err);
          if (err) {
            // console.log('====================================');
            console.log(err);
            // console.log('====================================');
          }
        });
      } else {

        console.log(err)
        // console.log('====================================');
        // console.log(err);
        // console.log('====================================');
      }
    }
  );
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (userData, token) => {
  console.log("Reset Email");
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.appURL}/reset-password?token=${token}`;
  const text = `To reset your password, click on the below link.
  If you did not request any password resets, then ignore this email.`;


  console.log("Reset Email",userData.email,subject,text,userData.name,resetPasswordUrl);


  await sendEmail(userData.email, subject, text, userData.name, resetPasswordUrl);
};

const sendSurveyLink = async (user,subject = "Survey Link", url) => {
  // console.log(url,user);
  ejs.renderFile(
    'src/services/email-template/survey-link.html',
    {
      url,user
    },
    (err, html) => {
      if (!err) {
        const mailOptions = {
          from: `${config.email.from} <${config.email.from}>`,
          to: `${user.email} <${user.email}>`,
          subject,
          html,
        };
        transport.sendMail(mailOptions, (err,data) => {
          // console.log("Error ----------- ", err);
          // console.log("Email data",data);
          return data;
          // if (err) {
          //   // console.log('====================================');
          //   // console.log(err);
          //   // console.log('====================================');
          // }
        });
      } else {
        // console.log('====================================');
        // console.log(err);
        // console.log('====================================');
      }
    }
  );
};


const accountRegistrationEmail = async (user, subject = "Tamanna - Account Creation Confirmation",username,pwd) =>{
  ejs.renderFile(
    'src/services/email-template/registration.html',
    {
     user
    },
    (err, html) => {
      if (!err) {
        const mailOptions = {
          from: `${config.email.from} <${config.email.from}>`,
          to: `${user.email} <${user.email}>`,
          subject,
          html,
        };
        transport.sendMail(mailOptions, (err,data) => {
          // console.log("Error ----------- ", err);
          // console.log("Email data",data);
          return data;
          // if (err) {
          //   // console.log('====================================');
          //   // console.log(err);
          //   // console.log('====================================');
          // }
        });
      } else {
        // console.log('====================================');
        // console.log(err);
        // console.log('====================================');
      }
    }
  );

}

module.exports = {
  transport,
  sendEmail,
  sendSurveyLink,
  sendResetPasswordEmail,
  accountRegistrationEmail
};
