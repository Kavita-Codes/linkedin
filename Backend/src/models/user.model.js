import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
       type:String,
        required:true,
        unique:true 
    },
    password:{
         type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:""
    },
    bannerPic:{
        type:String,
        default:""
    },
    headline:{
        type:String,
        default:""
    },
    skills:[{type:String}],
    education:[                              //may be multiple education- b.tech,m.tech and each have college name etc
        {                                   // [{},{}]   Array of Objects
            college:{
                type:String
            },
            degree:{
                type:String
            },
            fieldOfStudy:{
                type:String
            }
        }
    ],

    location:{
        type:String
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    experience:[
        {
            title:{type:String},
            company:{type:String},
            description:{type:String}
        }
    ],
    connection:[
       {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
       }
    ]


},{timestamps:true})


const User = mongoose.model("User",userSchema)
export default User