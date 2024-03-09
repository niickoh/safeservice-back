/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {initializeApp} = require("firebase-admin/app");
// const {getFirestore} = require("firebase-admin/firestore");
initializeApp();
const {setGlobalOptions} = require("firebase-functions/v2");
setGlobalOptions({maxInstances: 10});
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/obtener", async (req, res) => {
  logger.info("Hello logs!", {structuredData: true});
  res.send({message: "Listando correctamente"});
});
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.app = onRequest(app);
