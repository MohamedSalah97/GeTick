import express,{Request,Response} from 'express';
import { requireAuth } from '@mohamedl3zb-ticketing/common';
import { Order } from '../models/orders';
import { Ticket } from '../models/ticket';

const router = express.Router()

router.get('/api/orders', requireAuth,async(req:Request, res:Response) =>{
    const page: number = parseInt(req.query.page as string);
    const ticketsPerPage:number = 10;

    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket')
    .skip((page - 1) * ticketsPerPage)
    .limit(ticketsPerPage);
        
    res.send(orders);
})

export {router as getAllOrdersRouter}