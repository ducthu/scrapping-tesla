const config = require("../config/db");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
  useCreateIndex: true,
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;

module.exports = {
  Tesla: require("../models/tesla.model")
};
