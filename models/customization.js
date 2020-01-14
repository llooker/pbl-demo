const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Customization = new Schema({
    username: {
        type: String,
        required: true
    },
    customizations: {
        type: Array,
        default: null
    },
});

module.exports = mongoose.model('Customization', Customization);

