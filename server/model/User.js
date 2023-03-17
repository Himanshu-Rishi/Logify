import mongoose  from "mongoose";

export const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Please provide a unique username"],
        unique: true
    },
    email:
    {
        type: String,
        required: [true, "Please provide a valid email"],
        unique: true
    },
    password:
    {
        type: String,
        required: [true, "Please provide a valid password"]
    },
    first_name:{
        type: String,
    },
    last_name:{
        type: String,
    },
    address:{
        type: String,
    },
    profile:{
        type: String,
    },
    mobile_number:{
        type: Number,
    }
})

export default mongoose.model('User', UserSchema)