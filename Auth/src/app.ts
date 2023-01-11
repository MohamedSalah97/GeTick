import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from '@mohamedl3zb-ticketing/common';
import { NotFoundError, currentUser } from '@mohamedl3zb-ticketing/common';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: false
}))

app.use(currentUser);

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(currentUserRouter);


app.all('*', async (req,res,next) =>{
    throw new NotFoundError();
})
app.use(errorHandler);

export {app} ;