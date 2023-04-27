import Post from "../models/post.js";
import cloudinary from 'cloudinary';
import User from "../models/user.js";

const Cloudinary = cloudinary.v2;

export const createPost = async(req, res) => {
    try{

       const {captionHeading,captionDescription} = req.body;
       const image = req.file.path;
       const {token} = req.headers;

       console.log(image);

       if(!captionHeading || !captionDescription || !image){
        return res.status(300).json({
            success:false,
            message:"all the fields are mandatory."
        })
       }

       const user = await User.findOne({token});

       const post = await Post.create({
        user:user._id,
        imageUrl:image,
        captionHeading,
        captionDescription,
       })

       user.posts.push(post._id);
       await user.save();
       

       res.status(200).json({
        success:true,
        message:"post created successfuly",
        post,
       })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const deletePost = async(req, res) => {
    try{
        const user=await User.findOne({token: req.headers.token});
        let allPosts = user.posts;
        let postFound = false;

        const post=await Post.findByIdAndDelete(req.params.id);

        for(let i = 0; i<allPosts.length; i++){
            if(allPosts[i].toString() === req.params.id){
                postFound = true;
                await Post.findByIdAndDelete(req.params.id);
                user.posts.splice(i, 1);
                await user.save();

            }
        }

        if(!postFound){
            return res.status(401).json({
                success:false,
                message:"post id is invalid or you are trying to delete someone else post"
            })
        }
        
        else{
            return res.status(200).json({
                success:true,
                message:"post deleted successfully"
            })
        }



    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const allPosts = async(req, res) => {
    try{
        const posts = await Post.find().populate("user");
        const posttoshow = posts.reverse();
        res.status(200).json({
            success:true,
            posttoshow,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const userPosts = async(req, res) => {
    try{
        const user=await User.findOne({_id: req.params.id}).populate("user");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user doestnot exists"
            })
        }
        const postToShow = user.posts.reverse();
        res.status(200).json({
            success:true,
            postToShow,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const myPosts = async(req, res) => {
    try{
        const user=await User.findOne({token: req.headers.token}).populate('posts');
        console.log(user)

        const postToShow = user.posts.reverse();
        res.status(200).json({
            success:true,
            postToShow:user,
        })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const likeAndDislikePost = async(req, res) => {
    try{
        const user= await User.findOne({token:req.headers.token});
        const post = await Post.findById(req.params.id);
        
        if(!post){
            return res.status(401).json({
                message:"Post does not exist",
                success:false,
            })
        }

        let likes=post.likes;
        for(let i=0;i<likes.length;i++){
            if(user._id.toString()===likes[i].toString()){
                post.likes.splice(i,1);
                await post.save();
                return res.status(200).json({
                    message:"Post Unliked",
                    success:true,
                })
            }
        }
        
        post.likes.push(user._id);
        await post.save();
        return res.status(200).json({
            message:"Post liked",
            success:true,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const addComment = async(req, res) => {
    try{
        const {comment}=req.body;
        const id=req.params.id;
        const user= await User.findOne({token:req.headers.token});
        const post=await Post.findById(id);

        if(!post){
            return res.status(401).json({
                message:"Post does not exist",
                sucesss:false,
            })
        }

        post.comments.push({
            user:user._id,
            comment
        });

        await post.save();

        return res.status(200).json({
            message:"Commment made",
            success:true,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
