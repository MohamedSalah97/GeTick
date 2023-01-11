import { DatabaseConnectionError } from '@mohamedl3zb-ticketing/common';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () =>{
    try {
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
        
    } catch (error) {
        console.log(error);
    }

}

start();