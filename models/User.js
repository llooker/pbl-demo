const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    google_id: {
        type: String,
        required: true
    },
    api_user_token: {
        type: Object,
        required: true
    },
    looker_user_id: {
        type: String,
        required: true
    },
    api_token_last_refreshed: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('User', User);