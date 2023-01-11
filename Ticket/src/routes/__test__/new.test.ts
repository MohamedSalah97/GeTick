import { app } from "../../app";
import request from "supertest";
import { signin } from "../../test/signin-helper";
import { Ticket } from "../../models/Ticket";
import { natsWrapper } from "../../nats-wrapper";


it('Requires authentication to be accessed', async() =>{
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401)
})

const cookie = signin();
it('returns status other than 401 if authenticated', async ()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set("Cookie", cookie)
        .send({})
    
    expect(response.status).not.toEqual(401);
})

it('returns error if invalid title', async() =>{
    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'',
            price: 445
        })
        .expect(400)

        await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            price: 445
        })
        .expect(400)
})

it('returns error if invalid price', async() =>{
    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'test',
            price: -10
        })
        .expect(400)
    
        await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'test'
        })
        .expect(400)
})

it('creates ticket with valid parameters', async() =>{
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'test',
            price: 10
        })
        .expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
})

it('publishes an event', async() =>{

    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'test',
            price: 10
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})