import Connection from "../models/connection.model.js"
import User from "../models/user.model.js"

export async function sendConnection(){
 try {
    let {id} = req.params
    let sender = req.userId 

    let user = await User.findById(sender)

    if(sender == id){
        return res.status(400).json({
            message:"you cannot send connection to yourself"
        })

    }

    if(user.connection.includes(id)){
        return res.status(400).json({
            message:"connection already exists"
        })

    }

    let exitingConnection = await Connection.findOne({
       sender,
       reciever:id,
       status:pending
    })

    if(exitingConnection){
        return res.status(400).json({
            message:"connection already exists"
        }   )
    }

    let newRequest = await Connection.create({
        sender,
        reciever:id
    })

    return res.status(200).json(newRequest)

 } catch (error) {
    console.log(error)
    return res.status(500).json({
        message:error.message
    })
    
 }
}

export const acceptConnection = async(req,res)=>{
   try {
     let {connectionId} = req.params
    let connection = await Connection.findById(connectionId)

    if(!connection){
        return res.status(400).json({
            message:"connection not found"
        })
    }

    if(connection.status != pending){
        return res.status(400).json({
            message:"request under process"
        })

    }

    connection.status = accepted
    await connection.save()

    await User.findByIdAndUpdate(req.userId,{
        $addToSet:{connection:connection.sender._id}
    })

    await User.findByIdAndDelete(connection.sender._id , {
        $addToSet:{connection:req.userId}
    })

    return res.status(200).json({
        message:"connection accepted"
    })
   } catch (error) {
    return res.status(500).json({
        message:error.message
    })
   }

 }

 export const rejectConnection = async(req,res)=>{
   try {
     let {connectionId} = req.params
    let connection = await Connection.findById(connectionId)

    if(!connection){
        return res.status(400).json({
            message:"connection not found"
        })
    }

    if(connection.status != pending){
        return res.status(400).json({
            message:"request under process"
        })

    }

    connection.status = rejected
    await connection.save()

    return res.status(200).json({
        message:"connection rejected"
    })
   } catch (error) {
    return res.status(500).json({
        message:error.message
    })
   }

 }

 export const getConnections = async(req,res)=>{
    try{

    const targetUserId = req.params.userId
    const currentUserId = req.userId;

    let currrentUser = await User.findById(currentUserId)
  if(currentUser.connection.includes(targetUserId)){
    return res.json({status:"disconnect"})
  }

  const pendingRequests = await Connection.findOne({
    $or:[
        {sender:currentUserId, reciever:targetUserId, status:"pending"},
        {sender:targetUserId, reciever:currentUserId, status:"pending"}
    ],
    status:"pending",
  })

  if(pendingRequests){
    if(pendingRequests.sender.toString() === currentUserId){
        return res.json({status:"pending"})
    }else{
        return res.json({status:"recieved" , requestId:pendingRequests._id})
    }
  }

  return res.json({status:"connect"})

    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
 }

 export const removeConnection = async(req,res)=>{
    try {
        const myId =  req.userId
        const otherUserId = req.params.userId

 
        await User.findByIdAndUpdate(myId,{
            $pull:{connection:otherUserId}
        })

        await User.findByIdAndUpdate(otherUserId,{
            $pull:{connection:myId}
        })

        res.status(200).json({
            message:"connection removed successfully"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
 }

 export const getConnectionRequest =async()=>{
    try {
        const userId = req.userId
        const requests = await Connection.find({reciever:userId, status:"pending"}).populate("sender"  , " firstName lastName profilePic headline")

        return res.status(200).json(requests)
    } catch (error) {
       return res.status(500).json({
        message:error.message
       })
       
    }
 }

 export const getUserConnections = async()=>{
  try {
    const userId = req.userId

    const user = await User.findById(userId).populate("connection" , "firstName lastName profilePic headline")

  return  res.status.json(user.connection)


  } catch (error) {
    return res.status(500).json({
        message:error.message
    })
  }
 }
