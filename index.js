const express = require("express");
const app = express();
const http = require("http");
const port = 4000;

const scrappingService = require("./services/scrapping.service");

scrappingService
  .run()
  .then(data => {
    console.log("all urls: " + data);
  })
  .catch(console.error);

// ROUTERS
app.use("/tesla", require("./controllers/tesla.controller"));
app.use("/boncoin", require("./controllers/boncoin.controller"));

// GESTION DES ERREURS

app.listen(port, () => {
  console.log("Listenning on port: " + port + " => http://localost:" + port);
});
