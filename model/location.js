const mongoose = require('mongoose');

locationSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        require: true
    },
    longitude: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('location', locationSchema);