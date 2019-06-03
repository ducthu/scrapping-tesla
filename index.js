const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");

const CronService = require("./services/cron.service");
CronService.initCron();

app.use(cors());

// ROUTERS
app.use("/api", require("./controllers/tesla.controller"));

app.listen(port, () => {
  console.log("Listenning on port: " + port + " => http://localost:" + port);
});
