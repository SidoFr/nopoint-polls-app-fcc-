const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    facebook: {
        id: String,
        token: String,
        name: String,
    },
    twitter: {
        id: String,
        token: String,
        name: String,
    },
});

module.exports = mongoose.model('Auth', authSchema);