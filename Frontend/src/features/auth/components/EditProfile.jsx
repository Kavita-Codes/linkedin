import { useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useContext } from "react";
import { userDataContext } from "../../../context/UserContext";
import profile from "../../../assets/profile.png";
import bannerImage from "../../../assets/bannerImage.png";
import { authDataContext } from "../../../context/AuthContext";
import axios from "axios";

const EditProfile = () => {
  const { setEdit, userData ,setUserData } = useContext(userDataContext);

  const {serverUrl} = useContext(authDataContext)
  // Individual states
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [userName, setUserName] = useState(userData?.userName || "");
  const [headline, setHeadline] = useState(userData?.headline || "");
  const [location, setLocation] = useState(userData?.location || "");
  const [gender, setGender] = useState(userData?.gender || "male");

  const [skills, setSkills] = useState(userData?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const [education, setEducation] = useState(userData?.education || []);
  const [experience, setExperience] = useState(userData?.experience || []);

  const [frontendProfilePic , setFrontendProfilePic] = useState(userData?.profilePic || profile)
  const [backendProfilePic , setBackendProfilePic] = useState(null)

  const [frontendBannerPic , setFrontendBannerPic] = useState(userData?.bannerPic || bannerImage)
  const [backendBannerPic , setBackendBannerPic] = useState(null)
  const [saving , setSaving] = useState(false)

  const profilePic = useRef();
  const bannerPic = useRef();


  // --- Functions ---
  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }

  const addEducation = () =>
    setEducation([...education, { college: "", degree: "", fieldOfStudy: "" }]);
  const removeEducation = (index) =>
    setEducation(education.filter((_, i) => i !== index));

  const addExperience = () =>
    setExperience([...experience, { title: "", company: "", description: "" }]);
  const removeExperience = (index) =>
    setExperience(experience.filter((_, i) => i !== index));

  function handleProfilePic(e){
    const file = e.target.files[0]                 
     setBackendProfilePic(file)
    setFrontendProfilePic(URL.createObjectURL(file))
  }

  function handleBannerPic(e){
    const file = e.target.files[0]
     setBackendBannerPic(file)
    setFrontendBannerPic(URL.createObjectURL(file))
  }

 async function handleUpdateProfile(){
  setSaving(true)
   try {
    let formData = new FormData()
    formData.append("firstName" , firstName)
    formData.append("lastName" , lastName)
    formData.append("userName" , userName)
     formData.append("headline" , headline)
    formData.append("location" , location)  
    formData.append("gender" , gender)
formData.append("skills" , JSON.stringify(skills))
formData.append("education" , JSON.stringify(education))
formData.append("experience" , JSON.stringify(experience) )

if(backendProfilePic){
  formData.append("profilePic" , backendProfilePic)
}

if(backendBannerPic){
  formData.append("bannerPic" , backendBannerPic)
}


let result = await axios.put(serverUrl + "/api/user/update-profile", formData , {
  withCredentials:true
})

setUserData(result.data.user)
setEdit(false)
setSaving(false)
    
   } catch (error) {
    console.log(error)
    setSaving(false)
   }
}


  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-gray-400 bg-opacity-50">
      <div className="w-[90%] max-w-[600px] h-[85vh] bg-white rounded-lg shadow-lg relative p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={() => setEdit(false)}>
            <RxCross1 size={24} />
          </button>
        </div>


        <input type="file"  accept="image/*" hidden ref={profilePic} onChange={handleProfilePic}/>
        <input type="file"  accept="image/*" hidden ref={bannerPic} onChange={handleBannerPic}/>
        

        {/* Banner & Profile */}
        <div className="relative mb-16">
          <div className="h-32 bg-gray-200 rounded-lg" onClick={()=>bannerPic.current.click()}>        
            <img
              src={frontendBannerPic}
              className="w-full h-full object-cover rounded-lg"
              alt="Banner"
            />
            <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white">
              📷
            </button>
          </div>

        
         <div className=" w-30  relative inline-block" onClick={()=>profilePic.current.click()} >
          
            <img
            src={frontendProfilePic}
            className="absolute -bottom-10 left-6 w-30 h-25 rounded-full border-4 border-white bg-white"
            alt="Profile"
          />
          <button className="absolute bottom-0 left-30 top-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white text-xs font-bold">
            +
          </button>
         </div>

        
        
        </div>

        {/* Inputs */}
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border rounded-md p-2 w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            <input
              className="border rounded-md p-2 w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
          <input
            className="border rounded-md p-2 w-full"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
          />
          <input
            className="border rounded-md p-2 w-full"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Headline"
          />
          <input
            className="border rounded-md p-2 w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />

          <select
            className="w-full border rounded-md p-2"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Skills Section */}
          <div>
            <h3 className="font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2 my-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer "
                >
                  {skill}{" "}
                  <button onClick={() => removeSkill(skill)}>
                    <RxCross1 size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="border rounded-md p-2 flex-grow"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill"
              />
              <button
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 rounded-md  cursor-pointer "
              >
                Add
              </button>
            </div>
          </div>

          {/* Education Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Education</h3>
              <button
                onClick={addEducation}
                className="text-blue-600 font-bold  cursor-pointer "
              >
                + Add
              </button>
            </div>
            {education.map((edu, i) => (
              <div
                key={i}
                className="border p-4 rounded-md mb-4 bg-gray-50 relative space-y-3"
              >
                <button
                  onClick={() => removeEducation(i)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700  cursor-pointer "
                >
                  <RxCross1 size={16} />
                </button>

                <div className="grid grid-cols-1 gap-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    College Name
                  </label>
                  <input
                    className="w-full border-b bg-transparent outline-none p-1 text-sm font-medium"
                    value={edu.college}
                    onChange={(e) => {
                      let updated = [...education];
                      updated[i].college = e.target.value;
                      setEducation(updated);
                    }}
                  />

                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Degree
                  </label>
                  <input
                    className="w-full border-b bg-transparent outline-none p-1 text-sm"
                    value={edu.degree}
                    onChange={(e) => {
                      let updated = [...education];
                      updated[i].degree = e.target.value;
                      setEducation(updated);
                    }}
                  />

                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Field of Study
                  </label>
                  <input
                    className="w-full border-b bg-transparent outline-none p-1 text-sm"
                    value={edu.fieldOfStudy}
                    onChange={(e) => {
                      let updated = [...education];
                      updated[i].fieldOfStudy = e.target.value;
                      setEducation(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Experience</h3>
              <button
                onClick={addExperience}
                className="text-blue-600 font-bold  cursor-pointer "
              >
                + Add
              </button>
            </div>
            {experience.map((exp, i) => (
              <div
                key={i}
                className="border p-4 rounded-md mb-4 bg-gray-50 relative space-y-3"
              >
                <button
                  onClick={() => removeExperience(i)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700  cursor-pointer "
                >
                  <RxCross1 size={16} />
                </button>

                <div className="grid grid-cols-1 gap-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Job Title
                  </label>
                  <input
                    className="w-full border-b bg-transparent outline-none p-1 text-sm font-medium"
                    value={exp.title}
                    onChange={(e) => {
                      let updated = [...experience];
                      updated[i].title = e.target.value;
                      setExperience(updated);
                    }}
                  />

                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Company Name
                  </label>
                  <input
                    className="w-full border-b bg-transparent outline-none p-1 text-sm"
                    value={exp.company}
                    onChange={(e) => {
                      let updated = [...experience];
                      updated[i].company = e.target.value;
                      setExperience(updated);
                    }}
                  />

                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Description
                  </label>
                  <textarea
                    className="w-full border-b bg-transparent outline-none p-1 text-sm h-16"
                    value={exp.description}
                    onChange={(e) => {
                      let updated = [...experience];
                      updated[i].description = e.target.value;
                      setExperience(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t pt-4">
          <button
            onClick={() => setEdit(false)}
            className="px-6 py-2 rounded-full font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold cursor-pointer" onClick={handleUpdateProfile}>
           {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
