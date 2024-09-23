import { Router } from "express";

import Classes from "../models/classes.model.js";
import Events from "../models/events.model.js";
import Locations from "../models/locations.model.js";
import User from "../models/users.models.js";

const router = Router();

router.get('/', async (request, response) => {
    request.session.visited = true;
    const classes = await Classes.find({})
    const events = await Events.find({})
    const locations = await Locations.find({})
    const userData = await User.findById(request.session.userId);
    let user;
    if (userData) {
        user = {
            username: userData.username,
            admin: userData.admin,
            points: userData.points,
        };
    }
    else {
        user = {
            username: 'Guest',
            admin: false,
        };
    }
    response.render('ufopamaps', { apiKey: process.env.GOOGLE_MAPS_API_KEY, classes, events, locations, user });
});

router.post('/db/:collection', async (request, response) => {
    if (request.params.collection === 'events') {
        const eventName = request.body.eventName;
        if (!eventName) return response.status(400).send({ msg: 'error', detail: 'No filter aplied' });

        const event = await Events.findOne({ name: eventName });
        if (!event) return response.status(400).send({ msg: 'error', detail: 'No Event found' });
        else return response.send(event);
    }
    else return response.status(404).send({ msg: 'error', detail: 'No Colletion found' });
})

export default router;