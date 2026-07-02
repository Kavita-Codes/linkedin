import Navbar from '../components/Navbar';
import Post from '../components/Post';
import profile from "../../../assets/profile.png";
import bannerImage from "../../../assets/bannerImage.png"
import { useContext } from 'react';
import { userDataContext } from '../../../context/UserContext';
import EditProfile from '../components/EditProfile';
import PostPopup from '../components/PostPopup';


const Home = () => {

 let { userData, posts, edit, setEdit, uploadPost, setUploadPost } = useContext(userDataContext)


  return (

  
    <div className="bg-[#f3f2ef] min-h-screen">
      <Navbar />
      
      {/* 3 Columns Layout Configuration */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5 p-4 mt-4">
        
        {/* 1. Left Sidebar (Width: Less than Middle) */}
        <div className="md:col-span-3 bg-white rounded-lg border h-fit shadow-sm overflow-hidden">
  {/* Banner Image with Camera Icon */}
  <div className="h-20 bg-gray-200 relative">
    <img src={userData?.bannerPic || bannerImage} className="w-full h-full object-cover" alt="Banner" />
    <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white">
      📷
    </button>
  </div>

  {/* Profile Details */}
  <div className="px-4 pb-4">
    <div className="relative inline-block">
      <img 
        src={userData?.profilePic || profile} 
        alt="Profile" 
        className="w-20 h-20 rounded-full -mt-10 border-4 border-white object-cover" 
      />
      {/* Camera/Plus Icon on profile */}
      <button className="absolute bottom-2 right-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white text-xs font-bold">
        +
      </button>
    </div>

    <h2 className="font-bold text-lg mt-2 text-gray-800">{userData ? `${userData.firstName} ${userData.lastName}`: "User"}</h2>
    <p className="text-sm text-gray-500">{userData?.headline || "MERN Developer"}</p>
    <p className="text-xs text-gray-400">{userData?.location || "India"}</p>

    {/* Edit Profile Button */}
    <button className="w-full mt-4 border border-blue-500 text-blue-600 rounded-full py-1.5 font-semibold hover:bg-blue-50 flex items-center justify-center gap-2" onClick={()=> setEdit(true)} >
      Edit Profile ✏️
    </button>
  </div>
</div>


{edit && <EditProfile />}

{uploadPost && <PostPopup/>}


        {/* 2. Middle Feed Area (Width: Maximum/Center) */}
        <div className="md:col-span-6 space-y-4">
          {/* Create Post Card */}
          <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-3">
            <img src={userData?.profilePic || profile} className="w-10 h-10 rounded-full object-cover" alt="Me" />
            <input 
              placeholder="Start a post" 
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-full text-sm font-medium outline-none transition cursor-pointer" 
              onClick={()=>setUploadPost(true)}
            />
          </div>
          
          {/* Posts List */}
          {posts.length > 0 ? (
            posts.map((post , index) => (
              <Post
                key={index}
                id={post._id}
                author={post.author}
                image={post.image}
                likes={post.likes}
                comments={post.comments}
                description={post.description}
                createdAt={post.createdAt}
              />
            ))
          ) : (
            <div className="bg-white p-4 rounded-lg border shadow-sm text-center text-gray-500">
              No posts yet.
            </div>
          )}

        </div>

        {/* 3. Right Sidebar (Width: Same as Left Sidebar) */}
        <div className="md:col-span-3 bg-white rounded-lg border h-fit shadow-sm p-4 hidden md:block">
          <h3 className="font-bold text-sm text-gray-800 mb-3">Add to your feed</h3>
          
          {/* Recommendation list placeholder */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">JS</div>
              <div>
                <h4 className="text-xs font-bold text-gray-700">JavaScript Community</h4>
                <p className="text-[10px] text-gray-400">Company • Tech</p>
                <button className="mt-1 border border-gray-500 rounded-full px-3 py-0.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                  + Follow
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Home;