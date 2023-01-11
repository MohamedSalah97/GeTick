import { Publisher, Subjects, TicketCreatedEvent } from "@mohamedl3zb-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}