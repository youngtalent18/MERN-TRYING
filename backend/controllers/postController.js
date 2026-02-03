import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import { v2 as cloudinary} from "cloudinary"

export async function createPost(req, res){

    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId).select("-password");
        if(!user) return res.status(404).json({error: "User not found"});

        if(!img && !text) return res.status(400).json({error: "User must add a text or img"});

        if(img){
            const uploadResponse =  await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url; 
        }

        const newPost = new Post({
            user:userId,
            text,
            img
        })

        await newPost.save();
        return res.status(201).json(newPost);
    } catch (error) {
        console.log("Error in post controller", error)
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

export async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                error: "Post not found"
            });
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(400).json({
                error: "You cannot delete this post"
            });
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.log("Error in deletePost controller", error)
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

export async function commentOnPost(req, res){
    try {
        const { text } = req.body;
        const userId = req.user._id;

        if(!text) return res.status(404).json({error: "This field is required"});

        const post = await User.findById(req.params.id);

        if(!post) return res.status(404).json({error: "Post not found"});

        const comment = { user: userId, text};

        post.comments.push(comment);



    } catch (error) {
        console.log("Error in commentOnPost controller", error)
        res.status(500).json({
            error: "Internal server error"
        });
    }
}