import mongoose, { Mongoose } from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true,
    },
    fullname: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
        unique: true,
        minLength: 6,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    followers : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }
    ],
    profileImg: {
        type: String,
        default: "",
    },
    profileImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    link: {
        type: String,
        default: "",
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;