import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/users.models.js";

const router = Router();

router.get('/register', async (request, response) => {
    response.render('register');
});

router.post('/register', async (request, response) => {
    const existentUser = await User.findOne({ username: request.body.username });
    if (existentUser) return response.send({ existentUser: true });
    else {
        const newUser = await User.create({
            username: request.body.username,
            password: await bcrypt.hash(request.body.password, 10),
            admin: false,
            points: 0
        })
        request.session.userId = newUser.id;
        return response.send({ existentUser: false });
    }
});

export default router;