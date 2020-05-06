import * as express from 'express';
import { User } from './models/user';
const userRoutes = express.Router();
import * as Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation'

const validator = createValidator()

const userValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    dateOfBirth: Joi.string().required(),
    gender: Joi.string().required()
})

userRoutes.get('/users', async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    const users = await User.find({});
    resp.status(200).send({ success: true, message: "get all users", users: users });
});

userRoutes.post('/users', validator.body(userValidator), async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender
    });

    try {
        const savedUser = await newUser.save();
        resp.status(200).send({ success: true, message: "User has been added", user: savedUser });
    } catch (err) {
        resp.status(401).send({ success: false, message: "User not added", err });
    }
});

userRoutes.put('/user/:id', validator.body(userValidator), async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    const userData = req.body;
    try {
        const updatedData = await User.updateOne({ _id: id }, userData);
        resp.status(200).send({ success: true, message: "User has been updated", user: updatedData });
    } catch (err) {
        resp.status(401).send({ success: false, message: "User not updated", err });
    }
});

userRoutes.get('/user/:id', async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    try {
        const userData = await User.findById(id);
        resp.status(200).send({ success: true, message: "User data", user: userData });
    } catch (err) {
        resp.status(401).send({ success: false, message: "User not updated", err });
    }
});

userRoutes.delete('/user/:id', async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    try {
        await User.deleteOne({ _id: id });
        resp.status(200).send({ success: true, message: "User has been deleted" });
    } catch (err) {
        resp.status(401).send({ success: false, message: "User not updated", err });
    }
});

export { userRoutes }