import request from 'supertest';
import { app } from '../../app';

it('returns 400 for invalid email', async () =>{
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test',
            password:"password"
        })
        .expect(400)
})

it('returns 400 for invalid password', async () =>{
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password:"p"
        })
        .expect(400)
})

it('returns 400 for missing email and password', async () =>{
    await request(app)
    .post('/api/users/signin')
    .send({
        email:"test@test.com"
    })
    .expect(400)
    return request(app)
        .post('/api/users/signin')
        .send({
            password: "password"
        })
        .expect(400)
})

it('fails with given not existed password', async () =>{
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: "password"
        })
        .expect(400)
});

it('fails signing up with wrong password', async () =>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:"test@test.com",
        password: "password"
    })
    .expect(201)
    return request(app)
        .post('/api/users/signin')
        .send({
            email:"test@test.com",
            password: "passwor"
        })
        .expect(400)
})

it('s et a cookie in successful signup', async () =>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:"test@test.com",
        password: "password"
    })
    .expect(201)
    const response= await request(app)
        .post('/api/users/signin')
        .send({
            email:"test@test.com",
            password: "password"
        })
        .expect(200)
    expect(response.get('Set-Cookie')).toBeDefined()
})