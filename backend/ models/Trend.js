const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
  tendencia: { type: String, required: true },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trend', trendSchema);
