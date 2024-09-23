import mongoose from "mongoose";

const events = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: String,
    location: String,
    url: String,
    target_id: String,
});

const Events = mongoose.model('EventsRequest', events, 'EventsRequest');
export default Events;