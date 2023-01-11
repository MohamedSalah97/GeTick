import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@mohamedl3zb-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async() =>{
    // create instance of listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // creates and saves a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 10
    });
    await ticket.save()
    //create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'new test',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    //create fake message object
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return{listener, data,msg, ticket};
}

it('find, updates, saves a ticket' , async() =>{
    const {listener, data,msg, ticket} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message' , async()=>{
    const {msg ,data, ticket, listener} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if skipped version', async() =>{
    const {data,msg,listener,ticket} = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data,msg);        
    } catch (error) {
        
    }

    expect(msg.ack).not.toHaveBeenCalled();
})