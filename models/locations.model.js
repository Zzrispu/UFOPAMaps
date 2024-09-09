import mongoose from "mongoose";

const location = new mongoose.Schema({
    block: {
        type: String,
        required: true,
    },
    imgs: Number,
    polygon: Array,
    rooms: Array
});

const Locations = mongoose.model('Locations', location, 'Locations');
export default Locations;