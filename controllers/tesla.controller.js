const express = require("express");
const router = express.Router();
const teslaService = require("../services/tesla.service");

router.get("/all", getAll);
router.get("/:id", getById);
router.delete("/:id", remove);

module.exports = router;

function getAll(req, res, next) {
  teslaService
    .getAll()
    .then(teslas => res.json(teslas))
    .catch(err => next(err));
}

function getById(req, res, next) {
  teslaService
    .getById(req.params.id)
    .then(tesla => res.json(tesla))
    .catch(err => next(err));
}

function remove(req, res, next) {
  teslaService.delete(req.params.id);
}
