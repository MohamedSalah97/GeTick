import { Ticket } from "../Ticket";

it('impelements optimistic concurrency control', async () =>{
    // create a ticket 
    const ticket = Ticket.build({
        title:'test',
        price: 5,
        userId: '123'
    });
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the instances
    firstInstance!.set({price: 7})
    secondInstance!.set({price:10});

    // save the first instance 
    await firstInstance!.save();
    // save the second instance and expects an error
    try {
        await secondInstance!.save();
    } catch (error) {
        return;
    }

    throw new Error('should not reach here')
});

it('increaments a version number on multiole saves', async ()=>{
    const ticket = Ticket.build({
        title:'test',
        price: 5,
        userId: '123'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);

})