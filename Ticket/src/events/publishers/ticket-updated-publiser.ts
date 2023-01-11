import { Publisher, Subjects, TicketUpdatedEvent } from "@mohamedl3zb-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}