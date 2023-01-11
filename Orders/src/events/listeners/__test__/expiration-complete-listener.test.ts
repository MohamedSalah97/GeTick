import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@mohamedl3zb-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/orders";
import { OrderCreatedPublisher } from "../../publishers/order-created-publisher";

const setup = async() =>{
    // create instance of listener
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    // creates and saves a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 10
    });
    await ticket.save()

    //create an order
    const order = Order.build({
        userId: 'hgfg',
        status: OrderStatus.Created,
        ticket,
        expiresAt: new Date()
    })
    await order.save();

    //create a fake data event
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }
    //create fake message object
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return{listener, data,msg, order, ticket};
}

it('updates order status to cancelled', async() =>{
    const {listener, order,ticket,data,msg} = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
     
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an order cancelled event', async() =>{
    const {listener, order,ticket,data,msg} = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id);
});

it('acks the message', async() =>{
    const {listener, order,ticket,data,msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});