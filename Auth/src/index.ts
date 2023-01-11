import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@mohamedl3zb-ticketing/common';
import {app} from './app';

const start = async () =>{
    try {
        if(!process.env.JWT_KEY){
            throw new Error('JWT_KEY is not defined')
        }
        if(!process.env.MONGO_URI){
            throw new Error('MONGO_URI is not defined')
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database')
    } catch (error) {
        console.log(error);
        throw new DatabaseConnectionError();
    }
    app.listen(3000, () => {
        console.log('Auth service is runing on 3000')
    })
}

start();