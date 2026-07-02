import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"


export async function getCurrentUser(req,res){
  try {
    const id = req.userId
    const user = await User.findById(id).select("-password")
    if(!user){
        return res.status(400).json({
            message:"user does not found"
        })
    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({
        message: error.message
    })
  }
}

export async function updateProfile(req,res){
     try {
      let {firstName , lastName , userName , headline , location, gender } = req.body

      let skills = req.body.skills ? JSON.parse(req.body.skills) : []
      let education = req.body.education ? JSON.parse(req.body.education) : []
      let experience = req.body.experience ? JSON.parse(req.body.experience) : []


      let profilePic;
      let bannerPic;
  console.log(req.files)
       
if(req.files.profilePic){
  profilePic = await uploadOnCloudinary(req.files.profilePic[0].path)

}

if(req.files.bannerPic){
  bannerPic = await uploadOnCloudinary(req.files.bannerPic[0].path)
}

let user = await User.findByIdAndUpdate(req.userId , {
  firstName,
  lastName,
  userName,
  headline,
  location,
  gender,
  skills,
  education,
  experience,
  profilePic,
  bannerPic
},{
  returnDocument: 'after'

}).select("-password")


return res.status(200).json({
  message:"profile updated successfully",
  success:true,
  user
})  

     } catch (error) {
      console.log(error)
      return res.status(500).json({
        message:error.message
      }   )
    }

}
