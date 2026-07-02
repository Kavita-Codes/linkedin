import express from "express"
import { getCurrentUser, updateProfile } from "../controllers/user.controller.js"
import {isAuth} from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"



const userRouter = express.Router()

userRouter.get("/current-user", isAuth, getCurrentUser)
userRouter.put("/update-profile", isAuth,upload.fields([
    {name:"profilePic", maxCount:1},
    {name:"bannerPic", maxCount:1}
]), updateProfile)



export default userRouter