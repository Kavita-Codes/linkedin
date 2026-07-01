import { createContext, useEffect, useState } from "react";
import AuthContext, { authDataContext } from "./AuthContext"; // AuthContext se data lane ke liye useContext sahi hai
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
    // 1. Hooks ko function ke body ke andar
    const { serverUrl } = AuthContext(authDataContext); 
    const [userData, setUserData] = useState(null);

    const getCurrentUser = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/user/current-user", {
                withCredentials: true
            });
            setUserData(result.data);
        } catch (error) {
            console.log(error);
            setUserData(null);
        }
    };

    // 2. Component mount hone par call hoga
    useEffect(() => {
        getCurrentUser(); // () lagana zaroori hai execute karne ke liye
    }, []);

    const value = { userData, setUserData };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
};

export default UserContext;