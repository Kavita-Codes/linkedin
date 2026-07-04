import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./features/auth/pages/Home"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import { useContext } from "react"
import { userDataContext } from "./context/UserContext"
import Network from "./features/auth/pages/Network"
import Profile from "./features/auth/pages/Profile"


const App = () => {

const {userData} = useContext(userDataContext)

  return (
   <Routes>
    <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
    <Route path="/login" element={userData ? <Navigate to="/" /> : <Login />} />
    <Route path="/register" element={userData ? <Navigate to="/" /> : <Register />} />
      <Route path="/network" element={userData ? <Network /> : <Navigate to="/login" />} />
        <Route path="/profile" element={ userData ? <Profile /> : <Navigate to="/login" />} />
   </Routes>
  )
}

export default App




