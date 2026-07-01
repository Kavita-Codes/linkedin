import { useNavigate } from "react-router-dom"
import logo from "../../../assets/logo.svg"
import { useContext, useState } from "react"
import { authDataContext } from "../../../context/AuthContext"
import axios from "axios"
import { userDataContext } from "../../../context/UserContext"

const Register = () => {
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
   const {userData , setUserData} = useContext(userDataContext)
 
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  // Register Handler
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await axios.post(serverUrl + "/api/auth/register", {
        firstName,
        lastName,
        userName,
        email,
        password
      },{withCredentials:true})
      console.log("Registration successful:", result.data)
      setLoading(false)
      setUserData(result.data)
      navigate("/")
      setFirstName("")
      setLastName("")
      setUserName("")
      setEmail("")
      setPassword("")
      
    } catch (error) {
      console.error("Registration failed:", error)
      setLoading(false)
      setUserData(null)
    }
  }

  return (
    <div className="w-full h-screen p-3 flex items-center flex-col justify-start">
      <div className="h-[30px] w-full flex items-center">
        <img src={logo} alt="Logo" />
      </div>
      
      <form onSubmit={handleRegister} className="w-[300px] h-auto mt-12 md:shadow-xl flex flex-col justify-center p-4 gap-4">
        <h1 className="text-gray-800 text-[30px] font-semibold mb-[20px]">Sign Up</h1>
        
        <input type="text" placeholder="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-[100%] h-[30px] border-1 text-gray-800 border-gray-700 px-[10px] py-[5px] rounded-md" />
        <input type="text" placeholder="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-[100%] h-[30px] border-1 text-gray-800 border-gray-700 px-[10px] py-[5px] rounded-md"/>
        <input type="text" placeholder="userName" value={userName} onChange={(e) => setUserName(e.target.value)} required className="w-[100%] h-[30px] border-1 text-gray-800 border-gray-700 px-[10px] py-[5px] rounded-md"/>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-[100%] h-[30px] border-1 text-gray-800 border-gray-700 px-[10px] py-[5px] rounded-md" />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-[100%] h-[30px] border-1 text-gray-800 border-gray-700 px-[10px] py-[5px] rounded-md" />
        
        <button type="submit" className="w-[100%] h-[30px] rounded-full bg-blue-500 text-white">
          {
             loading ? "Loading..." : "Sign Up"
          }
          </button>
        <p className="text-center">Already have an account? <span className="text-blue-700 cursor-pointer" onClick={() => navigate('/login')}>login</span></p>
      </form>
    </div>
  )
}

export default Register