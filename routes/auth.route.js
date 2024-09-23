import { request, response, Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/users.models.js";

const router = Router();

router.post('/auth', async (request, response) => {
    const user = await User.findOne({
        username: request.body.username,
    });
    if (!user) {
        request.session.error = 1
        return response.redirect('/login');
    }

    const isHashedPassword = await bcrypt.compare(request.body.password, user.password);
    if (isHashedPassword) {
        request.session.userId = user.id;
        return response.redirect('/');
    }
    else {
        request.session.error = 2
        return response.redirect('/login');
    }
});

router.get('/logout', async (request, response) => {
    request.session.userId = null;
    return response.redirect('/');
})

router.get('/login', async (request, response) => {
    response.render('login', { error: request.session.error });
    request.session.error = 0;
});

export default router;