import request from 'supertest';
import { setOriginalNode } from 'typescript';
import { app } from '../../app';
import { signin } from '../../test/signin-helper';
import mongoose, { Mongoose } from 'mongoose';


it('returns 404 if the ticket is not found', async() =>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
});

it('returns the ticket if it founded', async()=>{
    const cookie = signin();
    const title = 'test';
    const price = 10 ;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title,
            price
        })
        .expect(201)

    const ticketRes = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200)
    expect(ticketRes.body.title).toEqual(title);
    expect(ticketRes.body.price).toEqual(price);

});