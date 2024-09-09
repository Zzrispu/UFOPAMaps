import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from './models/users.models.js';
import Classes from './models/classes.model.js';
import Events from './models/events.model.js';
import Locations from './models/locations.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

let log_in_err = 0;

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Conectado à DataBase');
    })
    .catch((error) => {
        console.log(`[ERROR]: ${error}`)
    });

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', './public/views');

app.get('/', async (request, response) => {
    const classes = await Classes.find({})
    const events = await Events.find({})
    const locations = await Locations.find({})
    response.render('ufopamaps', { apiKey: process.env.GOOGLE_MAPS_API_KEY, classes, events, locations });
});

app.get('/login', async (request, response) => {
    response.render('login', { error: log_in_err });
    log_in_err = 0;
});

app.post('/authenticate', async (request, response) => {
    const user = await User.findOne({
        name: request.body.username,
    });
    if (!user) {
        log_in_err = 1;
        return response.redirect('/login');
    }

    const isHashedPassword = bcrypt.compareSync(request.body.password, user.password);
    if (isHashedPassword) {
        return response.redirect('/dashboard');
    }
    else {
        log_in_err = 2;
        return response.redirect('/login');
    }
})

app.get('/dashboard', async (request, response) => {
    const classes = await Classes.find({});
    const events = await Events.find({});
    const locations = await Locations.find({});
    response.render('dashboard', { classes, events, locations });
});

app.listen( process.env.PORT || 3000, () => {
    console.log('Site no ar.');
});