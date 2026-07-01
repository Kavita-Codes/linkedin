import jwt from "jsonwebtoken"

async function isAuth(req,res,next){
   try {
    const{ token} = req.cookies
    if(!token){
        return res.status(400).json({
            message:"user does not have token"
        })
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded){
        return res.status(400).json({
            message:"user does not have valid token"
        })
    }

    req.id = decoded.id 
    next()
   } catch (error) {
    return res.status(500).json({
        message:"is auth error"
    })
    
   }
}

export default isAuth