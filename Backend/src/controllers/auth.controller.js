import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


export async function registerController(req,res){
    try {
        const {firstName,lastName,userName, email,password} = req.body

        if(!firstName || !lastName || !userName || !email || !password){
            return res.status(400).json({
                message:"all fields are required",
                success:false
            })
        }

        if(password.length < 4){
            return res.status(400).json({
                message:"password must be atleast 4 charcater"
            })
        }
        
        const isUserExists = await User.findOne({
            $or:[
                {email},
                {userName}
            ]
        })

        if(isUserExists){
            return res.status(400).json({
                message:"user already registered",
                success:false
            }) 
        }

        const hashedPass = await bcrypt.hash(password,10)

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password:hashedPass
        })

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
        
        res.cookie("token",token ,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            secure: process.env.NODE_ENVIRONMENT === "production",
            sameSite: "none",
            path: "/"
        })

        return res.status(201).json({
            message:"user registered successfully",
            success:true,
           user
        })

     } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({
                message:"user already registered",
                success:false
            })
        }
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

export async function loginController(req,res){
    try {
        const { email,password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message:"all fields are required",
                success:false
            })
        }
        
        const user = await User.findOne({email })

        if(!user){
            return res.status(400).json({
                message:"user does not exists",
                success:false
            }) 
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({
                message:"password does not match"
            })
        }

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
        
        res.cookie("token",token ,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            secure: process.env.NODE_ENVIRONMENT === "production",
            sameSite: "none",
            path: "/"
        })

        return res.status(200).json({
            message:"user loggedIn successfully",
            sucess:true,
            user
            
        })


     } catch (error) {
            return res.status(500).json({
                message:"login controller error",
                success:false,
                
            })
    }
}

export async function logOutController(req,res){
    try {
        res.clearCookie("token")             //pass cookie name to delete
        return res.status(200).json({
            message:'logout successfully',
            success:true

        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}


