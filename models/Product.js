const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const productSchema = new mongoose.Schema({
  productId: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: { type: String, required: true },
  image: String,
});

module.exports = mongoose.model("Product", productSchema);
