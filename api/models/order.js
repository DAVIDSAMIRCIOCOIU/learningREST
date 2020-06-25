const mongoose = require('mongoose');

// Schema: layout, the design of the object , the model will be the constructor
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);