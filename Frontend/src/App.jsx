import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./features/auth/pages/Home"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import { useContext } from "react"
import { userDataContext } from "./context/UserContext"


const App = () => {

const {userData} = useContext(userDataContext)

  return (
   <Routes>
    <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
    <Route path="/login" element={userData ? <Login /> : <Navigate to="/login" />} />
    <Route path="/register" element={userData ? <Register /> : <Navigate to="/register" />} />
   </Routes>
  )
}

export default App


// 4:58:00