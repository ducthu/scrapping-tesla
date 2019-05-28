const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  lbid: { type: String, unique: true, required: true },
  titre: { type: String, required: true },
  prix: { type: String, required: true },
  pro: { type: Boolean, default: false },
  date_lb: { type: Date },
  date: { type: Date, default: Date.now },
  localisation: { type: String },
  marque: { type: String },
  modele: { type: String },
  annee: { type: Date },
  km: { type: Number },
  fuel: { type: String, default: "electrique" },
  boite_vitesse: { type: String, default: "automatique" },
  reference: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  lien: { type: String, required: true, unique: true }
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Tesla", schema);
