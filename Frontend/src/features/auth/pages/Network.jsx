
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useContext } from 'react'
import { authDataContext } from '../../../context/AuthContext'
import { useState } from 'react'
import { useEffect } from 'react'
import profile from "../../../assets/profile.png"; // Default image
import { Check, X } from 'lucide-react'; 

const Network = () => {

    const {serverUrl} = useContext(authDataContext)
    let [connections , setConnections] = useState([])

 const handleGetRequests = async ()=>{
    try {
        let result = await axios.get(`${serverUrl}/api/connection/requests` , {withCredentials:true})
        setConnections(result.data)
    } catch (error) {
        console.log(error)
    }
 }

const handleAcceptConnection = async(requestId)=>{
  try {
      let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}` ,{} ,{withCredentials:true})
       setConnections(connections.filter((connection)=>connection._id !== requestId))
      
  } catch (error) {
      console.log(error)
  }
}

const handleRejectConnection = async(requestId)=>{
  try {
      let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}` ,{} ,{withCredentials:true})
       setConnections(connections.filter((connection)=>connection._id !== requestId))
  } catch (error) {
      console.log(error)
  }
}

useEffect(()=>{
    handleGetRequests()
},[])

return (
    <div className='w-full min-h-screen bg-gray-100'>
      <Navbar />
      
      <div className='max-w-4xl mx-auto mt-6 p-4'>
        {/* Invitation Header */}
        <div className='bg-white p-4 rounded-lg border border-gray-200 mb-4 font-semibold'>
          Invitations {connections.length}
        </div>

        {/* Connections List */}
        <div className='bg-white rounded-lg border border-gray-200 divide-y divide-gray-200'>
          {connections.map((connection, index) => (
            <div key={index} className='flex items-center justify-between p-4 hover:bg-gray-50'>
              
              {/* Left Side: Image & Name */}
              <div className='flex items-center gap-4'>
                <img 
                  src={connection.sender.profilePic || profile} 
                  alt="Profile" 
                  className='w-16 h-16 rounded-full object-cover border' 
                />
                <div>
                  <h3 className='font-bold text-lg'>
                    {`${connection.sender.firstName} ${connection.sender.lastName}`}
                  </h3>
                  <p className='text-sm text-gray-500'>Full Stack Developer</p>
                </div>
              </div>

              {/* Right Side: Accept/Reject Buttons */}
              <div className='flex items-center gap-2'>
                <button className='p-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition' onClick={()=>handleAcceptConnection(connection._id)}>
                  <Check size={24} />
                </button>
                <button className='p-2 rounded-full border-2 border-gray-400 text-gray-400 hover:bg-gray-100 transition'  onClick={()=>handleRejectConnection(connection._id)}>
                  <X size={24} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Network