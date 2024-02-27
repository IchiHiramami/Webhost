import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        require: true
    },
    longitude: {
        type: Number,
        require: true
    }
});

export default mongoose.model('location', locationSchema);