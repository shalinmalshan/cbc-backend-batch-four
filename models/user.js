import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        default: "not given"
    },
    isDisable: {
        type: Boolean,
        required: true,
        default: false
    },
    isEmailVarified: {
        type: Boolean,
        required: true,
        default: false
    },
    profilePicture:{
        type: String,
        required: true,
        default: null
    }

})

const User=mongoose.model("users",userSchema)
export default User;