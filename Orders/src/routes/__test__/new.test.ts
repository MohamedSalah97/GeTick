import { app } from "../../app";
import request from "supertest";
import { signin } from "../../test/signin-helper";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { Order, OrderStatus } from "../../models/orders";
import mongoose from "mongoose";

const cookie = signin();


it('Requires authentication to be accessed', async() =>{
    await request(app)
    .post('/api/orders')
    .send({})
    .expect(401)
})

it('returns status other than 401 if authenticated', async ()=>{
    const response = await request(app)
    .post('/api/orders')
    .set("Cookie", cookie)
    .send({})
    
    expect(response.status).not.toEqual(401);
})

it('returns error if no ticketId', async() =>{
    await request(app)
    .post('/api/orders')
    .set('Cookie',cookie)
    .send()
    .expect(400)
    
});

it('returns an error if ticket does not exist', async() =>{
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
    .post('/api/orders')
    .set("Cookie", cookie)
    .send({ticketId})
    .expect(404)
})

it('returns an error if ticket is reserved', async() =>{
    const ticket = Ticket.build({
        title:'test',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const order = Order.build({
        userId: 'kjhgfhjkldd',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    })
    await order.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie',cookie)
        .send({ticketId: ticket.id})
        .expect(400)
        
})


it('reserves a ticket', async() =>{
    const ticket = Ticket.build({
        title:'test',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',cookie)
        .send({ticketId: ticket.id})
        .expect(201)
    
})

it('publishes an event',async() =>{
    const ticket = Ticket.build({
        title:'test',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',cookie)
        .send({ticketId: ticket.id})
        .expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})