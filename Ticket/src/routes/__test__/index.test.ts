import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin-helper';



const createTicket = () =>{

    const cookie = signin();
    const title = 'test';
    const price = 10 ;
    
    return request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title,
            price
        })
        .expect(201)
}

it('it retrieves a list of tickets', async() =>{
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/api/tickets')
        .query({page: 1})
        .send()
        .expect(200)
    expect(response.body.length).toEqual(3);
})