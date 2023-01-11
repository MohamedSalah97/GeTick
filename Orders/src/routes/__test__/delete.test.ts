import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { signin } from "../../test/signin-helper";
import { Order,OrderStatus } from "../../models/orders";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

const buildTicket = async (title: string, price: number) =>{
    const ticket = Ticket.build({
        title,
        price,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    return ticket;
}

it('cancel an order', async() =>{
    const ticket = await buildTicket('test',1);

    const user = signin();
   

    const {body: order} =await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket.id})
        .expect(201)

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)


    const canceledOrder = await Order.findById(order.id);

    expect(canceledOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits an order cancelled event', async() =>{
    const ticket = await buildTicket('test',1);

    const user = signin();
   

    const {body: order} =await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket.id})
        .expect(201)

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})