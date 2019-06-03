const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  titre: { type: String, required: true },
  prix: { type: String, required: true },
  marque: { type: String },
  modele: { type: String },
  annee: { type: Date },
  km: { type: Number },
  boite_vitesse: { type: String, default: "automatique" },
  description: { type: String, required: true },
  lien: { type: String, required: true, unique: true }
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Tesla", schema);
