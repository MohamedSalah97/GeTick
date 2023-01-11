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

it('fetches orders for particular user', async() =>{
    // create 3 tickets 
    const ticket1 = await buildTicket('test1',1);
    const ticket2 = await buildTicket('test2',2);
    const ticket3 = await buildTicket('test3',3);

    const user1 = signin();
    const user2= signin();
    //create order as user1
    await request(app)
        .post('/api/orders')
        .set('Cookie',user1)
        .send({ticketId: ticket1.id})
        .expect(201)

    // create order as user 2
    const {body: order1} = await request(app)
        .post('/api/orders')
        .set('Cookie',user2)
        .send({ticketId: ticket2.id})
        .expect(201)

    const {body: order2} =await request(app)
        .post('/api/orders')
        .set('Cookie',user2)
        .send({ticketId: ticket3.id})
        .expect(201)
    // make a request to get orders for user 2 

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .send()
        .expect(200)

    //make sure that orders belongs to user 2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
})