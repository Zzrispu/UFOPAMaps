import { Router } from "express";
import Classes from "../models/classes.model.js";
import Events from "../models/events.model.js";
import Locations from "../models/locations.model.js";
import User from "../models/users.models.js";

const router = Router();

router.get('/dashboard', async (request, response) => {
    if (!request.session.userId) {
        request.session.error = 3;
        return response.redirect('/login');
    }
    else {
        const userId = await User.findById(request.session.userId);
        if (!userId || userId.admin == false ) {
            console.log('usuario não autorizado');
            request.session.error = 4;
            return response.redirect('/login');
        };
    }
    const classes = await Classes.find({});
    const events = await Events.find({});
    const locations = await Locations.find({});
    response.render('dashboard', { classes, events, locations });
});

export default router;