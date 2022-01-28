const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: [
    {
      type: String,
      required: true,
    },
  ],
  inStock: {
    type: Boolean,
    default: true,
  },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  color: [
    {
      type: String,
      required: true,
    },
  ],
  img: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Product", productSchema);
