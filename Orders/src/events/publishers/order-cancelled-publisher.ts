import { natsWrapper } from "../../nats-wrapper";
import { Publisher, Subjects, OrderCancelledevent } from "@mohamedl3zb-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledevent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}