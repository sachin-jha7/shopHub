import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true,'Full Name is required']
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        unique: true
    },
    password: {
        type: String,
        reqired: [true, 'Password is required']
    }
});

const user = mongoose.model("user", userSchema);

export default user;