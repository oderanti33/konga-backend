const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    id: { type: Number, required: true },
    category1: { type: String, required: true },
    category2: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    productCode: { type: Number, required: true },
    price: { type: Number, required: true },
    soldBy: { type: String, required: true },
    url: { type: String, required: true },
    realPrice: { type: Number },
});

module.exports = mongoose.model('products', productSchema)