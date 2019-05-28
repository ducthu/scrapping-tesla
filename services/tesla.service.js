const db = require("../config/database");
const Tesla = db.Tesla;

module.exports = {
  getAll,
  getById,
  create,
  delete: _delete
};

async function getAll() {
  return await Tesla.find();
}

async function getById(id) {
  return await Tesla.findById(id);
}

async function _delete(id) {
  await Tesla.findByIdAndDelete(id);
}

async function create(teslaParams) {
  if (await Tesla.findOne({ lbid: teslaParams.lbid })) {
    throw "This Tesla is already in the database";
  }

  if (await Tesla.findOne({ reference: teslaParams.reference })) {
    throw "This Tesla is already in the database";
  }

  const tesla = new Tesla(teslaParams);
  await tesla.save();
}

async function checkValidity(id) {}
