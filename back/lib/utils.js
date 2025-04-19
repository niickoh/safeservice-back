/* eslint-disable linebreak-style */
const {google} = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");

const getGmailService = function() {
  const oAuth2Client = new google.auth.OAuth2(
      // eslint-disable-next-line max-len
      process.env.CLIENT_ID_GCP,
      process.env.CLIENTE_SECRET_GCP,
      "https://safeservicechile.cl/",
  );
  // eslint-disable-next-line max-len
  oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN_GCP});
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
