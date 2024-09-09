import mongoose from "mongoose";

const events = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: String,
    location: String,
    url: String,
});

const Events = mongoose.model('Events', events, 'Events');
export default Events;