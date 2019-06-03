const config = require("../config/db");
const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://cluster0-cdbmv.mongodb.net/test?retryWrites=true";
const MONGODB_USER = "dv";
const MONGODB_PASS = "BtC&n3J6mgztukNGTT6%Rk2VmvHm2RA&";

const authData = {
  user: MONGODB_USER,
  pass: MONGODB_PASS,
  useNewUrlParser: true,
  useCreateIndex: true
};
mongoose.connect(MONGODB_URI, authData, err => {
  if (!err) {
    console.log("MongoDB connection succeeded.");
  } else {
    console.log(
      "Error in MongoDB connection : " + JSON.stringify(err, undefined, 2)
    );
  }
});

module.exports = {
  Tesla: require("../models/tesla.model")
};
