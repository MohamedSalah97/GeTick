import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/Ticket";
import { OrderCancelledevent } from "@mohamedl3zb-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async() =>{
    const listener = new OrderCancelledListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'test',
        price: 10,
        userId: 'jhgf',
    });
    const orderId = new mongoose.Types.ObjectId().toHexString()
    ticket.set({orderId})
    await ticket.save();

    const data:OrderCancelledevent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, msg}
};

it('sets userId in the ticket and reserves it',async() =>{
    const {listener, data, ticket, msg} = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
});

it('acks the message', async() =>{
    const {listener, data, ticket, msg} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('publishes an ticket updated event', async() =>{
    const {listener, data, ticket, msg} = await setup();

    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})