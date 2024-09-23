import { Router } from "express";
import User from "../models/users.models.js";

const router = Router();

router.get('/dashboard', async (request, response) => {
    // if (!request.session.userId) {
    //     request.session.error = 3;
    //     return response.redirect('/login');
    // }
    // else {
    //     const userId = await User.findById(request.session.userId);
    //     if (!userId || userId.admin == false ) {
    //         console.log('usuario não autorizado');
    //         request.session.error = 4;
    //         return response.redirect('/login');
    //     };
    // }
    response.render('dashboard');
});

export default router;