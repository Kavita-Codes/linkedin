import { useContext } from "react"
import { authDataContext } from "../../../context/AuthContext"
import axios from "axios"
import { useEffect } from "react"
import { io } from "socket.io-client"
import { userDataContext } from "../../../context/UserContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const socket = io("http://localhost:3000")


const ConnectionButton = ({userId}) => {

    let {serverUrl}  = useContext(authDataContext)
    let {userData} = useContext(userDataContext)
    let [status , setStatus] = useState("connect")

    let navigate = useNavigate()

const handleSendConnection = async()=>{
    try {
        let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`,
            {},{withCredentials:true}

        )

        console.log(result)
        setStatus("pending")
    } catch (error) {
        console.log(error)
        const message = error.response?.data?.message
        if (message === "connection already exists") {
            setStatus("pending")
        }
        if (message === "user does not have token" || message === "user does not have valid token") {
            navigate("/login")
        }
    }
}

const handleGetStatus = async()=>{
    try {
        let result = await axios.post(`${serverUrl}/api/connection/get-status/${userId}`,
            {},{withCredentials:true}

        )

        console.log(result)
        setStatus(result?.data?.status || "connect")
    } catch (error) {
        console.log(error)
        setStatus("connect")
    }
}

const handleRemoveConnection = async()=>{
    try {
        let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,
            {withCredentials:true}

        )

        console.log(result)
        setStatus(result.data.result)
    } catch (error) {
        console.log(error)
    }
}

useEffect(()=>{
    if(userData?._id){
        socket.emit("addUser" , userData._id)
    }
   handleGetStatus()

    socket.on("statusUpdate" , ({updatedUserId,newStatus})=>{
       if(updatedUserId == userId){
         setStatus(newStatus)
       }
    })

    return ()=>{
        socket.off("statusUpdate")
    }

},[userId, userData?._id])

const handleClick = async()=>{
    if(status == "disconnect"){
        await handleRemoveConnection()
    }else if(status == "received"){
        navigate("/network")
    }else{
        await handleSendConnection()
    }
}

  return (
    <div>
          <button 
            className={`px-6 py-2 rounded-full font-bold text-white bg-blue-600 `} disabled={status == "pending"} onClick={handleClick}>
             {status}
          </button>
    </div>
  )
}

export default ConnectionButton