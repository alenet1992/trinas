import mongoose from 'mongoose';

export interface userData {
  email: String;
  role: String;
  _id: String;
  name: String;
}


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password : String ,
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    }
});

const User = mongoose.models.User  || mongoose.model('User', UserSchema);

export default User;