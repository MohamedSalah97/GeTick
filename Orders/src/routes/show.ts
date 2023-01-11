import express,{Request,Response} from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@mohamedl3zb-ticketing/common';
import { Order } from '../models/orders';

const router = express.Router()

router.get('/api/orders/:id', requireAuth,async(req:Request, res:Response) =>{
    const {id} = req.params;

    const order = await Order.findById(id).populate('ticket');
    
    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    res.send(order);
    
})

export {router as getOrderRouter}