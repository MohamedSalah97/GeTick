import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@mohamedl3zb-ticketing/common';
import {app} from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/orders-created-listener';

const start = async () =>{
    try {
        if(!process.env.JWT_KEY){
            throw new Error('JWT_KEY is not defined')
        }
        if(!process.env.MONGO_URI){
            throw new Error('MONGO_URI is not defined')
        }
        if(!process.env.NATS_CLUSTER_ID){
            throw new Error('NATS_CLUSTER_ID is not defined')
        }
        if(!process.env.NATS_CLIENT_ID){
            throw new Error('NATS_CLIENT_ID is not defined')
        }
        if(!process.env.NATS_URI){
            throw new Error('NATS_URI is not defined')
        }
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID , process.env.NATS_URI);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
        throw new DatabaseConnectionError();
    }
    app.listen(3000, () => {
        console.log('Ticket service is runing on 3000')
    })
}

start();