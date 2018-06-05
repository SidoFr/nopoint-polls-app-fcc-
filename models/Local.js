const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const localSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

localSchema.plugin(passportLocalMongoose, { usernameField: 'name' });

module.exports = mongoose.model('Local', localSchema);