const mongoose = require('mongoose');

const memcoinSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ticker: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  ownerEmail: { type: String, required: true }
});

module.exports = mongoose.model('Memcoin', memcoinSchema);


