const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    min: 0,
  },
  number_in_stock: {
    type: Number,
    min: 0,
    default: 0, 
  },
  image_url: {
    type: String,
  },
});

ItemSchema.virtual('url').get(function() {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
