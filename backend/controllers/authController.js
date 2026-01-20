import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js"

export async function signUp(req, res) {
    try {
        const { fullname, password, email, username} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"});
        }

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.status(400).json({ error: "username already exists" });
        }

        const existingEmail = await User.findOne({email});

        if(existingEmail){
            return res.status(400).json({ error: "Email already exists" });
        }

        if(password.length < 6){
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        //Let's hash Our password here

        const salt = await bcrypt.genSalt(10);

        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPass
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            })
        }else{
            return res.status(400).json({
                error: "Invalid user data"
            })
        }

        
    }catch (error) {
        console.log("Error in user controller", error.message);
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export async function login(req, res){
    try {
        const { username, password } = req.body;

        const user = await User.findOne({username});
        const isPassCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPassCorrect){
            return res.status(400).json({
                error: "Invalid username or password"
            });
        }
        generateTokenAndSetCookie(user._id, res);

        return res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            followers: user.followers,
            following: user.following
        });
    } catch (error) {
        console.log("Error in user controller", error.message);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

export async function logout(req, res){
    try{
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message: "logged out sucessfully"})
    }catch(error){
        console.log("Error in logout controller", error)
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

export async function getMe(req, res) {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error)
        res.status(500).json({
            error: "Internal server error"
        });
    }
}