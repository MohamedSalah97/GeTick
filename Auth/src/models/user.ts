import mongoose from "mongoose";
import { Password } from "../services/password";

interface IUser {
    email: string;
    password: string;
}


// interface that describes props that user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(userAttrs: IUser): UserDoc;
}

//interface that describes a single user has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.statics.build = (userAttrs: IUser) => {
    return new User(userAttrs)
}

userSchema.pre('save', async function(done) {
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }

    done();
})

const User = mongoose.model<UserDoc,UserModel>('User', userSchema);

export {User};