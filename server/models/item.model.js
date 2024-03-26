const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number },
  store: { type: String },
  image: { type: String }
});

const Item = mongoose.model('item', itemSchema);

module.exports = Item;