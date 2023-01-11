import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@mohamedl3zb-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = () =>{
    // create instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client)
    //create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    //create fake message object
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return{listener, data,msg};
}

it ('creates and saves a ticket', async () =>{
    //call the onMessage
    const {listener, data, msg} = setup();
     
    await listener.onMessage(data, msg);
    // write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);

});

it('acks the message', async() =>{
    //call the onMessage
    const {listener, data, msg} = setup();
    await listener.onMessage(data, msg);

    // write assertions to make sure that ack function has been called
    expect(msg.ack).toHaveBeenCalled()
})