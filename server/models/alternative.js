const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AlternativeSchema = new Schema({
  text: { type: String, required: true },
});
const Alternative = mongoose.model('Alternative', AlternativeSchema);

module.exports = AlternativeSchema;
