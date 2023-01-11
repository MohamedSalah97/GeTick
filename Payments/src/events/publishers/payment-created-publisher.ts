import { Publisher, PaymentCreatedEvent, Subjects } from "@mohamedl3zb-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}