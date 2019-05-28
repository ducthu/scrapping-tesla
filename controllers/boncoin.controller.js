const express = require("express");
const router = express.Router();
const boncoinService = require("../services/scrapping.service");

router.get("/", getAll);

module.exports = router;

function getAll(req, res, next) {
  boncoinService
    .getAll()
    .then(teslas => res.json(teslas))
    .catch(err => next(err));
}
