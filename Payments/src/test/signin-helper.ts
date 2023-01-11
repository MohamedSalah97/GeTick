import jwt  from 'jsonwebtoken';
import mongoose from 'mongoose';

const signin = (id?: string) =>{
    // build jwt payload
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
    // create the jwt
    const token = jwt.sign(payload, 'asdf');
    //build session object
    const session = {jwt: token};
    // turn session into JSON
    const jsonSession = JSON.stringify(session);
    // take json and turn it to base64
    const base64 = Buffer.from(jsonSession).toString('base64');
    // return it as a session
    return [`session=${base64}`];
}

export {signin};