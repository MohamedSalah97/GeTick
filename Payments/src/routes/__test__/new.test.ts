import request from "supertest";
import { Order } from "../../models/order";
import { app } from "../../app";
import { signin } from "../../test/signin-helper";
import mongoose from "mongoose";
import { OrderStatus } from "@mohamedl3zb-ticketing/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

const cookie = signin();

jest.mock('../../stripe');

it('returns 404 when trying to purchase an order that does not exist', async () =>{
    await request(app)
        .post('/api/payments')
        .set('Cookie',cookie)
        .send({
            token: 'jhggh',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
});

it('return 401 when order does not belong to the user', async () =>{
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        status: OrderStatus.Created
    })
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie',cookie)
        .send({
            token: 'jhggh',
            orderId: order.id
        })
        .expect(401)
});

it('returns 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = signin(userId);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 10,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie',cookie)
        .send({
            token: 'jhggh',
            orderId: order.id
        })
        .expect(400)

});

it('charges money with stripe in paying for order with 204 status', async () =>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = signin(userId);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 10,
        status: OrderStatus.Created
    })
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie',cookie)
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(order.price * 100);
    expect(chargeOptions.currency).toEqual('usd')
})

it("save payment details into the database",async () =>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const cookie = signin(userId);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 10,
        status: OrderStatus.Created
    })
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie',cookie)
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
    
    const payment = await Payment.findOne({
        orderId: order.id
    });

    expect(payment).not.toBeNull();
})