import express,{Request, Response} from 'express';
import {body} from 'express-validator';
import { validateRequest } from '@mohamedl3zb-ticketing/common';
import { BadRequestError } from '@mohamedl3zb-ticketing/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',[
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').trim().notEmpty().withMessage('Supply password')
] , validateRequest, async(req: Request, res:Response) =>{

    const {email,password} = req.body;
    const existingUser = await User.findOne({email});
    if(!existingUser){
        throw new BadRequestError("Invalid Credentials");
    }

    const match = await Password.compare(existingUser.password, password);
    if(!match){
        throw new BadRequestError("Invalid Credentials");
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },process.env.JWT_KEY!)

    req.session= {
        jwt: userJwt
    };

    res.status(200).send(existingUser);
})

router.get('/api/users', async(req,res) => {
    const users = await User.find();

    res.send(users);
})

export {router as signinRouter}