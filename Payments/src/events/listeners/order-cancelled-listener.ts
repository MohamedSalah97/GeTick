import { OrderCancelledevent,Listener,OrderStatus, Subjects } from "@mohamedl3zb-ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledevent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledevent['data'], msg: Message){
        const order = await Order.findOne({
            _id: data.id,
            version: data.version -1
        })

        if(!order){
            throw new Error('order not found');
        }
        order.set({
            status: OrderStatus.Cancelled
        });
        await order.save();

        msg.ack();
    }
}