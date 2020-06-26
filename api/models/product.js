const mongoose = require('mongoose');

// Schema: layout, the design of the object , the model will be the constructor
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    productImage: {type: String, required: true}
});

module.exports = mongoose.model('Product', productSchema);