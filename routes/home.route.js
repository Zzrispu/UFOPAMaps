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

export default router;