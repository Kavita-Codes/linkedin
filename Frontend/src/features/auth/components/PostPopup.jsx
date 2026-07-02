import  { useContext, useRef, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { IoImageOutline } from 'react-icons/io5';
import profile from "../../../assets/profile.png"; 
import { userDataContext } from '../../../context/UserContext';
import { authDataContext } from '../../../context/AuthContext';
import axios from 'axios';

const PostPopup = () => {
 

    let {serverUrl} = useContext(authDataContext)

  let { setUploadPost ,userData, setPosts, getPosts} = useContext(userDataContext)
  let [frontendImage, setFrontendImage] = useState("")
 let [backendImage, setBackendImage] = useState("")
  let [description , setDescription] = useState("")
  let [loading  ,setLoading] = useState(false)

  let image = useRef()

function handleImage(e){
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
}


async function handleUploadPost(){
    setUploadPost(true)
    setLoading(true)
    try {
        let formData = new FormData()
        formData.append("description" , description)

        if(backendImage){
         formData.append("image" , backendImage)
        }

        let result = await axios.post(serverUrl + "/api/post/create" , formData , {
            withCredentials:true
        })

        // Re-fetch posts to ensure author is populated and ordering is correct
        await getPosts()

        setLoading(false)
        setUploadPost(false)
        setDescription("")
        setFrontendImage("")
        setBackendImage("")
      
    } catch (error) {
        console.log(error)
        setLoading(false)
        setUploadPost(false)
    }
}



  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-gray-400 bg-opacity-50">
      <div className="w-[90%] max-w-[500px] bg-white rounded-lg shadow-xl relative p-5">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <img src={userData?.profilePic || profile} className="w-12 h-12 rounded-full" alt="Profile" />
            <h2 className="font-bold text-lg">{userData?.firstName || "User"}</h2>
          </div>
          <button className="hover:bg-gray-100 p-1 rounded-full cursor-pointer" onClick={() => setUploadPost(false)}>
            <RxCross1 size={20} />
          </button>
        </div>

        <input type="file" ref={image} hidden onChange={handleImage} />

        {/* Input Area */}
        <textarea
          className={`w-full ${frontendImage ? "h-15" : "h-40"} outline-none resize-none text-lg `}
          placeholder="What do you want to talk about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
            {frontendImage && <img src={frontendImage} alt="Preview" className='p-8' />}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-4 border-t pt-3">
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full" onClick={()=>image.current.click()}>
            <IoImageOutline size={24} />
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-bold text-white ${description ? 'bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={!description}
            onClick={handleUploadPost}
          >
            {
                loading ? "Posting..." : "Post"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;