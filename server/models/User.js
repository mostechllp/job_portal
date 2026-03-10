import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['seeker', 'admin'],
        default: "seeker",
    },
    profileImg: {
        type: String,
    }
}, {
    timestamps: true,
})

export const User = mongoose.model("User", UserSchema)