/* eslint-disable linebreak-style */
const {google} = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");

const getGmailService = function() {
  const oAuth2Client = new google.auth.OAuth2(
      // eslint-disable-next-line max-len
      "488929335992-ps346jshfod6n65e2tca4pt8tk0ibsf6.apps.googleusercontent.com",
      "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",
      "https://developers.google.com/oauthplayground",
  );
  // eslint-disable-next-line max-len
  oAuth2Client.setCredentials({refresh_token: "1//04Sg4zK--MLSVCgYIARAAGAQSNwF-L9Ir0Scq-21UXTK2d8HbwWb50RCuYo8eo_VdbU7Yp5waw0ceopFGWURwFES111eR234Jz6Y"});
  const gmail = google.gmail({version: "v1", auth: oAuth2Client});
  return gmail;
};

const encodeMessage = function(message) {
  return Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "-")
      .replace(/=+$/, "");
};

const createMail = async function(options) {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendMail = async function(options) {
  const gmail = getGmailService();
  const rawMessage = await createMail(options);
  const {data: {id}} = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: rawMessage,
    },
  });
  return id;
};
module.exports = sendMail;
