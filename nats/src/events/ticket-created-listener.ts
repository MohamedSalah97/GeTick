import { Message,Stan } from 'node-nats-streaming';
import { Listner } from "./base-listener";
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListner extends Listner<TicketCreatedEvent>{
    readonly subject:Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments:service';
    
    onMessage(data: TicketCreatedEvent['data'] , msg:Message){
        console.log('event data', data);

        msg.ack();
    }
}