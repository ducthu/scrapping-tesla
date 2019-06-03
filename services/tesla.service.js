const db = require("../config/database");
const Tesla = db.Tesla;

module.exports = {
  getAll,
  getById,
  create,
  delete: _delete,
  getAllUrls,
  getByUrl,
  checkValidity,
  getByUrlAndDelete,
  removeOldLink
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

async function getByUrlAndDelete(url) {
  return await Tesla.findOneAndDelete({ lien: url });
}

async function create(teslaParams) {
  const tesla = new Tesla(teslaParams);
  await tesla.save();
}

async function getAllUrls() {
  return await Tesla.distinct("lien");
}

async function getByUrl(url) {
  return await Tesla.findOne({ lien: url });
}

async function checkValidity(url) {
  return await Tesla.findOne({ lien: url }).then(data => {
    return data === null ? false : true;
  });
}

async function removeOldLink(tabAllUrls) {
  return await getAllUrls().then(urls => {
    let results = urls.filter(item => !tabAllUrls.includes(item));
    console.log("\n" + results.length + " annonces ont été supprimées");
    if (tabAllUrls.length !== 0) {
      for (var i = 0; i < results.length; i++) {
        getByUrlAndDelete(results[i]).then(
          console.log(results[i] + " supprimé.")
        );
      }
    }
  });
}
