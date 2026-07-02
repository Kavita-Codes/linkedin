import { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext"; // AuthContext se data lane ke liye useContext sahi hai
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
    // 1. Hooks ko function ke body ke andar
    const { serverUrl } = useContext(authDataContext); 
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    let [edit , setEdit] = useState(false)
    let [uploadPost , setUploadPost] = useState(false)



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

    const getPosts = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/post/get-posts", {
                withCredentials: true
            })

            const fetchedPosts = result?.data?.posts || result?.data || [];
            setPosts(fetchedPosts)
        } catch (error) {
            console.log(error);
        }
    }

    // 2. Component mount hone par call hoga
    useEffect(() => {
        getCurrentUser(); // () lagana zaroori hai execute karne ke liye
        getPosts()
        
    }, []);

    const value = { userData, setUserData, posts, setPosts, edit, setEdit, uploadPost, setUploadPost , getPosts};

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
};

export default UserContext;