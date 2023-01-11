import express,{Request,Response} from 'express';
import { body } from 'express-validator';
import { requireAuth,validateRequest,NotFoundError,NotAuthorizedError, BadRequestError } from '@mohamedl3zb-ticketing/common';
import { Ticket } from '../models/Ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publiser';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth,[
    body('title').not().isEmpty().withMessage('Titleis required'),
    body('price').isFloat({gt:0}).withMessage("Price must be greater than 0")
] , validateRequest,async(req:Request,res:Response) =>{
    const {title,price} = req.body;
    const {id} = req.params;

    const ticket = await Ticket.findById(id);
    if(!ticket){
        throw new NotFoundError(); 
    }
    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    if(ticket.orderId){
        throw new BadRequestError('Ticket is reserved can not be edited');
    }

    ticket.set({
        title,
        price
    })
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })

    res.send(ticket)
    
});

export {router as editTicketRouter}