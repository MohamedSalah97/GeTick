import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler,NotFoundError,currentUser } from '@mohamedl3zb-ticketing/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { getAllTicketsRouter } from './routes/index';
import { editTicketRouter } from './routes/update';


const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: false
}))

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(getAllTicketsRouter);
app.use(editTicketRouter);

app.all('*', async (req,res,next) =>{
    throw new NotFoundError();
})
app.use(errorHandler);

export {app} ;