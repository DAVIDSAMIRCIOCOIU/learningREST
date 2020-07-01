const mongoose = require('mongoose');

// Schema: layout, the design of the object , the model will be the constructor
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // note that unique won't count towards validation but it only optimizes the db
    email: {type: String, required: true, unique: true, match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
    password: {type: String, required: true},
    role: {type: String, enum: ['admin', 'customer', 'merchant'], default: 'customer', immutable: true}
});

module.exports = mongoose.model('User', userSchema);