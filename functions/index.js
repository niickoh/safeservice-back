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
const {getFirestore} = require("firebase-admin/firestore");
initializeApp();
const {setGlobalOptions} = require("firebase-functions/v2");
setGlobalOptions({maxInstances: 10});
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const ejs = require("ejs");
const resolve = require("path").resolve;
const app = express();
app.use(bodyParser.json());
app.use(cors());
const sendMail = require("./lib/utils");

app.post("/crear-contacto", async (req, res) => {
  logger.info("Hello logs!", {structuredData: true});
  const data = req.body.datosRegistro;
  const contactoAdd = await getFirestore()
      .collection("Users")
      .add(data);
  // eslint-disable-next-line max-len
  const file = fs.readFileSync(resolve("templates/inicio-temporada.html"), "utf-8");
  const body = req.body.datosCorreo;
  const html= ejs.render(file);
  const options = {
    to: body.correo,
    cc: body.correosCopia,
    subject: body.asunto,
    html: html,
    textEncoding: "base64",
    headers: [
      {key: "X-Application-Developer", value: "Amit Agarwal"},
      {key: "X-Application-Version", value: "v1.0.0.2"},
    ],
  };
  await sendMail(options);
  res.send({message: "Contacto creado correctamente", contactoAdd});
});
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.app = onRequest(app);
