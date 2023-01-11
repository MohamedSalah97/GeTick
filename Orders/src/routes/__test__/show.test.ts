import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { signin } from "../../test/signin-helper";
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

it('fetches particular order to user', async() =>{
    // create 3 tickets 
    const ticket = await buildTicket('test',1);

    const user = signin();
   

    const {body: order} =await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket.id})
        .expect(201)
    // make a request to get orders for user 2 

    const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)

    //make sure that orders belongs to user 2
    expect(response.body.id).toEqual(order.id);
})

it('fetches particular order to user', async() =>{
    // create 3 tickets 
    const ticket = await buildTicket('test',1);

    const user = signin();
   

    const {body: order} =await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket.id})
        .expect(201)
    // make a request to get orders for user 2 

    const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', signin())
        .send()
        .expect(401)

})
