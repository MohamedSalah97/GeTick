import express,{query, Request,Response} from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@mohamedl3zb-ticketing/common';
import {body} from 'express-validator';
import { Ticket } from '../models/ticket';
import {Order} from '../models/orders';
import { OrderCreatedEvent } from '@mohamedl3zb-ticketing/common';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60 ;

router.post('/api/orders',requireAuth,[
    body('ticketId').not().isEmpty().withMessage('TicketId must be provided')
], validateRequest,async(req:Request, res:Response) =>{
    
    const {ticketId} = req.body;
    // find the ticket that user are tryitng to purchase
    const ticket = await Ticket.findById(ticketId);

    if(!ticket){
        throw new NotFoundError();
    }
    // make sure that is not reserved
    const isReserved = await ticket.isReserved();

    if(isReserved){
        throw new BadRequestError('Ticket is already reserved'); 
    }

    //calculate an expiration time
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //build order and save it to database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();
    //publish event tht order has been created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: OrderStatus.Created,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
        ticket:{
            id: ticket.id,
            price: ticket.price
        }
    })

    res.status(201).send(order);
        
})

export {router as newOrderRouter}