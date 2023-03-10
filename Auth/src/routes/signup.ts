import express,{Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {body} from 'express-validator';
import { validateRequest } from '@mohamedl3zb-ticketing/common';
import { User } from '../models/user';
import { BadRequestError } from '@mohamedl3zb-ticketing/common';

const router = express.Router();

router.post('/api/users/signup',[
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').trim().isLength({min: 6, max: 20}).withMessage('Password must be between 6 and 20 characters')
] , validateRequest,async(req: Request,res: Response) =>{

    const {email, password} = req.body ;

    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new BadRequestError('Email already in use try another one')
    }

    const user = User.build({email, password});
    await user.save();

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    },process.env.JWT_KEY!)

    req.session= {
        jwt: userJwt
    };

    res.status(201).send(user);
})


export {router as signupRouter}