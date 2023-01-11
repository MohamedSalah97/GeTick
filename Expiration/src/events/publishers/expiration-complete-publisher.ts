import { Listener,Subjects,ExpirationCompleteEvent, Publisher } from "@mohamedl3zb-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}