import { createContext } from "react";


export const authDataContext = createContext()

function AuthContext({children}){

    const serverUrl = "http://localhost:3000"
   
    return (
        <div>
            <authDataContext.Provider value={{serverUrl}}>
                {children}
            </authDataContext.Provider>
        </div>
    )
}

export default AuthContext