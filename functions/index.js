/* eslint linebreak-style: ["error", "windows"] */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const path = require("path");

// Mock Data
const {mock1London} =
  require("./mocks/mock1.js");
const {mock2London, mock2Manchester, mock2Brandon} =
  require("./mocks/mock2.js");

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.geoJSONFile = functions.storage.object().onFinalize((object) => {
  const filePath = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);

  functions.logger.log("geoJSONFile:->",
      "filePath:", filePath,
      "fileDir:", fileDir,
      "fileName:", fileName,
      "contentType:", contentType
  );
  return functions.logger.log("geoJSONFile - Done.");
});

exports.gpCatchmentAreaServiceMock1 =
  functions.https.onRequest((request, response) => {
    response.contentType("application/json");
    response.status(200).send(JSON.stringify(mock1London));
  });

exports.gpCatchmentAreaServiceMock2 =
  functions.https.onRequest((request, response) => {
    response.contentType("application/json");
    response.status(200).send(JSON.stringify(mock2London));
  });

exports.gpCatchmentAreaServiceMock3 =
  functions.https.onRequest((request, response) => {
    const lng = request.query.lng;
    const lat = request.query.lat;
    const latlng = {lng: lng, lat: lat, gpset: []};

    response.contentType("application/json");
    const _lng = parseFloat(request.query.lng);
    const _lat = parseFloat(request.query.lat);

    if ((mock2London.lat == _lat) && (mock2London.lng == _lng)) {
      response.status(200).send(JSON.stringify(mock2London));
    } else if ((mock2Manchester.lat == _lat) && (mock2Manchester.lng == _lng)) {
      response.status(200).send(JSON.stringify(mock2Manchester));
    } else if ((mock2Brandon.lat == _lat) && (mock2Brandon.lng == _lng)) {
      response.status(200).send(JSON.stringify(mock2Brandon));
    } else {
      response.status(404).send(JSON.stringify(latlng));
    }
  });

/*
exports.ListFolder = functions.https.onRequest(
    (request, response) => {
      const bucket = admin.storage().bucket("nhs-models-001.appspot.com");
      bucket.getFiles((err, files) => {
        functions.logger.log("ListFolder.files:", files);
      });
      response.send("ListFolder-OK");
    });
*/
