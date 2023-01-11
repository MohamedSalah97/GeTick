import express,{query, Request,Response} from 'express';
import { Ticket } from '../models/Ticket';

const router = express.Router()

router.get('/api/tickets',async(req:Request, res:Response) =>{
    const page: number = parseInt(req.query.page as string);
    const ticketsPerPage:number = 10;

    const tickets = await Ticket.find({})
        .skip(page - 1)
        .limit(ticketsPerPage)
    
    res.send(tickets);
        
})

export {router as getAllTicketsRouter}