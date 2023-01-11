import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../models/Ticket";
import { OrderCreatedEvent,OrderStatus } from "@mohamedl3zb-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async() =>{
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'test',
        price: 10,
        userId: 'jhgf'
    });

    await ticket.save();

    const data:OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'jhgyt',
        expiresAt: 'jhgiuyt',
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
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

    expect(updatedTicket!.orderId).toEqual(data.id);
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