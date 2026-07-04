import  { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

// Default images agar database mein koi image na ho
import defaultProfile from "../../../assets/profile.png"; 
import defaultBanner from "../../../assets/bannerImage.png";
import { userDataContext } from '../../../context/UserContext';
import axios from 'axios';
import { authDataContext } from '../../../context/AuthContext';

const Profile = () => {
  const {serverUrl} = useContext(authDataContext)
  const { userData } = useContext(userDataContext);

  let [userConnection , setUserConnection] = useState([])

  if (!userData) return <div className="text-center mt-10">Loading profile...</div>;

  const handleGetUserConnection = async(e)=>{
    e.preventDefault()
    try {
      let result = await axios.get(`${serverUrl}/api/connection`,{withCredentials:true})
      setUserConnection(result.data)
    } catch (error) {
      console.log(error)
    }
  }

        useEffect(()=>{
          handleGetUserConnection()
          },[])


  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />
      
      <div className="max-w-4xl mx-auto mt-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Banner from userData */}
          <div className="h-48 w-full bg-gray-200">
            <img 
              src={userData.bannerPic || defaultBanner} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="relative">
              {/* Profile Image from userData */}
              <img 
                src={userData.profilePic || defaultProfile} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white -mt-16 object-cover bg-white"
              />
            </div>
            
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h1>
              <p className="text-gray-600 font-medium">{userData.headline}</p>
              <p className="text-sm text-gray-400 mt-1">{userData.location}</p>
              <p className="text-sm text-blue-600 font-semibold mt-2 cursor-pointer hover:underline">
                {userConnection.length || 0} connections
              </p>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          
          {/* Experience Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Experience</h2>
            {userData.experience?.length > 0 ? (
              userData.experience.map((exp, i) => (
                <div key={i} className="mb-4 border-b pb-2 last:border-0">
                  <h3 className="font-bold text-gray-800">{exp.title}</h3>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500 mt-1 italic">{exp.description}</p>
                </div>
              ))
            ) : <p className="text-gray-400 text-sm">No experience added yet.</p>}
          </div>

          {/* Education Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Education</h2>
            {userData.education?.length > 0 ? (
              userData.education.map((edu, i) => (
                <div key={i} className="mb-4 border-b pb-2 last:border-0">
                  <h3 className="font-bold text-gray-800">{edu.college}</h3>
                  <p className="text-sm text-gray-600">{edu.degree} • {edu.fieldOfStudy}</p>
                </div>
              ))
            ) : <p className="text-gray-400 text-sm">No education details added yet.</p>}
          </div>

          {/* Skills Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {userData.skills?.map((skill, i) => (
                <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;