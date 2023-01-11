import { app } from "../../app";
import request from "supertest";
import { signin } from "../../test/signin-helper";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

const cookie = signin();
const id = new mongoose.Types.ObjectId().toHexString()

it('returns 404 if ticket id is not existes',async ()=>{
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',cookie)
        .send({
            title: ';hgdhj',
            price: 20
        })
        .expect(404)
});

it('returns 401 for not authenticated',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: ';hgdhj',
            price: 20
        })
        .expect(401)
});

it('returns 401 if the user does not own the ticket',async ()=>{
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie',cookie)
        .send({
            title: 'hgdhj',
            price: 20
        })
        
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',signin())
        .send({
            title: 'hgdhjhj',
            price: 200
        })
        .expect(401)
});

it('returns 400 if user provided invalid title or price',async ()=>{
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie',cookie)
        .send({
            title: 'hgdhj',
            price: 20
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400)
});

it('updates a ticket successfully',async ()=>{
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie',cookie)
        .send({
            title: 'hgdhj',
            price: 20
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'hello',
            price: 20
        })
        .expect(200)
    const ticketRes = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticketRes.body.title).toEqual('hello');
});

it('it rejects edits on reserved tickets',async ()=>{
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie',cookie)
        .send({
            title: 'hgdhj',
            price: 20
        })

    const ticket = await Ticket.findById(response.body.id)
    ticket!.set({orderId: id})
    await ticket!.save()
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'hello',
            price: 20
        })
        .expect(400)
});


it('publishes an event on updating', async () =>{
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie',cookie)
        .send({
            title: 'hgdhj',
            price: 20
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'hello',
            price: 20
        })
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();

})