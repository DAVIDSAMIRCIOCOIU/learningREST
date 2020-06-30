const mongoose = require('mongoose');

// Schema: layout, the design of the object , the model will be the constructor
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true},
    password: {type: String, required: true}
});

module.exports = mongoose.model('User', orderSchema);