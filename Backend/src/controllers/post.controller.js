import uploadOnCloudinary from "../config/cloudinary.js"
import Post from "../models/post.model.js"

export async function createPost(req,res){

 try {
       let {description} = req.body
       let newPost;
 
    if(req.file){  
        let image = await uploadOnCloudinary(req.file.path)                          //comes from multer middleware
        newPost = await Post.create({
        author:req.userId,
        description,
        image
        
       })
    } else {
        newPost = await Post.create({
            author:req.userId,
            description
        })
    }

    return res.status(201).json({
        message: "Post created successfully",
        success: true,
        post: newPost
       
    })
 } catch (error) {
    console.log(error)
    return res.status(500).json({
        message:error.message
    })
 }
}

export async function getPosts(req, res){
    try {
        const posts = await Post.find()
            .populate("author", "firstName lastName profilePic headline")
            .populate("comments.user", "firstName lastName profilePic headline")
            .sort({createdAt:-1})      // -1 means new post first
        return res.status(200).json({
            message:"posts fetched successfully",
            success:true,
            posts
        })

    } catch (error) {
       console.log(error) 
       return res.status(500).json({
        message:error.message
       })
    
    }
}

export async function likePost(req,res){
    try{
        let postId = req.params.id
        let userId = req.userId

        let post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({
                message:"post not found"
            })
        }

        const alreadyLiked = post.likes.some((id) => id.toString() === userId.toString())

        if(alreadyLiked){
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString())
        }else{
            post.likes.push(userId)
        }

        await post.save()

        return res.status(200).json({
            message:"post liked successfully",
            success:true,
            likes: post.likes
        })

    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}

export async function commentPost(req,res){
    try{
        let postId = req.params.id
        let userId = req.userId
        let {comment} = req.body

        if(!comment || !comment.trim()){
            return res.status(400).json({
                message:"comment is required"
            })
        }

        let post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({
                message:"post not found"
            })
        }

        post.comments.push({
            user:userId,
            comment: comment.trim()
        })

        await post.save()

        post = await Post.findById(postId).populate("comments.user", "firstName lastName profilePic headline")

        return res.status(200).json({
            message:"comment posted successfully",
            success:true,
            post
        })

    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}