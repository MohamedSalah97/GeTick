import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/signin-helper';


it('responds with details of current user', async ()=>{
    const cookie = await signin();
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.currentUser !== null)
})

it('responds with null if not authenticated', async ()=>{
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()

    expect(response.body.currentUser === null)
})