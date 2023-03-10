import express,{Request,Response} from 'express';
import { requireAuth,NotAuthorizedError,NotFoundError } from '@mohamedl3zb-ticketing/common';
import { Order,OrderStatus } from '../models/orders';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router()

router.patch('/api/orders/:id', requireAuth, async(req:Request, res:Response) =>{
    const {id} = req.params;

    const order = await Order.findById(id).populate('ticket');
    
    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled ;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket:{
            id: order.ticket.id
        }
    })

    res.status(200).send({})
})

export {router as deleteOrderRouter}