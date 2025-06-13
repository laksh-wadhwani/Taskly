import { createContext, useContext } from "react";

export const BackendContext = createContext();

export const BackendProvider = ({children}) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9001";
    console.log("Loaded backendURL:", backendURL);

    return(
        <BackendContext.Provider value={backendURL}>
            {children}
        </BackendContext.Provider>
    )
}

export const BackendURL = () => {
    return useContext(BackendContext)
}