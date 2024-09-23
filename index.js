import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

import homeRouter from './routes/home.route.js';
import authRouter from './routes/auth.route.js';
import dashBoardRouter from './routes/dashboard.route.js';
import registerRouter from './routes/register.route.js';
import apiRouter from './routes/api.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

configDotenv();

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Conectado à DataBase');
    })
    .catch((error) => {
        console.log(`[ERROR]: ${error}`)
    });

app.set('view engine', 'ejs');
app.set('views', './public/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 6000 * 60 * 2
    }
}));

app.use(homeRouter);
app.use(authRouter);
app.use(dashBoardRouter);
app.use(registerRouter);
app.use(apiRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('Site no ar.');
});