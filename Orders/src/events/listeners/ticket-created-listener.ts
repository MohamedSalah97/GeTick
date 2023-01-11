import { TicketCreatedEvent,Subjects,Listener } from "@mohamedl3zb-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage (data: TicketCreatedEvent['data'], msg: Message) {
        const {id, title,price} = data ;

        const ticket = Ticket.build({
            id,
            title,
            price
        });
        await ticket.save();
        console.log(`working on message from ${this.subject}`)

        msg.ack();
    }
}