import { TicketUpdatedEvent,Subjects,Listener } from "@mohamedl3zb-ticketing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        const {id,title,price,version} = data ;

        const ticket = await Ticket.findForEvent(id,version);
        if(!ticket){
            throw new Error('ticket not found ');
        }
        
        ticket.set({title,price});
        await ticket.save();

        msg.ack();
    }
}