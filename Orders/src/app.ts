import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler,NotFoundError,currentUser } from '@mohamedl3zb-ticketing/common';
import { getAllOrdersRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';
import { getOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: false
}))

app.use(currentUser);
app.use(getAllOrdersRouter);
app.use(getOrderRouter);
app.use(newOrderRouter);
app.use(deleteOrderRouter);



app.all('*', async (req,res,next) =>{
    throw new NotFoundError();
})
app.use(errorHandler);

export {app} ;