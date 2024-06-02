const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
});

CategorySchema.virtual('url').get(function() {
  return `/inventory/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
