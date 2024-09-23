import Classes from "../models/classes.model.js";
import Events from "../models/events.model.js";
import EventsRequest from "../models/eventsRequests.model.js";
import Locations from "../models/locations.model.js";
import { Router } from "express";

const router = Router();

router.get('/api/:collection', async (request, response) => {
    const collection = request.params.collection;

    if (collection == 'classes') {
        const data = await Classes.find();
        return response.status(200).send(data);
    }
    else if (collection == 'events') {
        const data = await Events.find();
        return response.status(200).send(data);
    }
    else if (collection == 'events-requests') {
        const data = await EventsRequest.find();
        return response.status(200).send(data);
    }
    else if (collection == 'events-requests') {
        const data = await EventsRequest.find();
        return response.status(200).send(data);
    }
    else if (collection == 'locations') {
        const data = await Locations.find();
        return response.status(200).send(data);
    }
    else return response.status(400).send({ error: 'bad request' });
});

router.post('/api/:collection', async (request, response) => {
    const body = request.body;
    const query = request.query;

    const collection = request.params.collection;
    if (collection == 'classes') {
        const data = await Classes.create({
            instituto: body.instituto,
            graduacoes: body.graduacoes,
        });
        return response.status(200).send(data);
    }
    else if (collection == 'events') {
        if (body.target_id) {
            const data = await Events.findByIdAndUpdate(body.target_id, {
                name: body.name,
                date: body.date,
                location: body.location,
                url: body.url,
            });
            await EventsRequest.findOneAndDelete({ target_id: body.target_id });
            if (!data) return response.status(304).send({ error: 'No id found' });
            else return response.status(200).send(data);
        }
        else {
            const data = await Events.create({
                name: body.name,
                date: body.date,
                location: body.location,
                url: body.url,
            });
            return response.status(200).send(data);
        };
    }
    else if (collection == 'events-requests') {
        try {
            const data = await EventsRequest.create({
                name: body.name,
                date: body.date,
                location: body.location,
                url: body.url,
                target_id: body.target_id,
            });
            return response.status(200).send(data);
        } catch (error) {
            console.log(error);
            return response.status(406).send({ error: `${error}` });
        }
    }
    else if (collection == 'locations') {
        const data = await Locations.create({
            block: body.block,
            imgs: body.imgs,
            polygon: body.polygon,
            rooms: body.rooms,
        });
        return response.status(200).send(data);
    }
    else return response.status(400).send({ error: 'bad request' });
});

export default router;