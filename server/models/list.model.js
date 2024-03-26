const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  members: [{ type: String }],
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
      amount: { type: Number, default: 1 },
      user: { type: String }
    }
  ]
});

const List = mongoose.model('list', listSchema);

module.exports = List;