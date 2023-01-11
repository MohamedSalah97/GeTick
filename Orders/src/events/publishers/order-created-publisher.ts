import { Publisher, Subjects, OrderCreatedEvent } from "@mohamedl3zb-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}