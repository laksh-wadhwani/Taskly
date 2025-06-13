import { createContext, useContext } from "react";

export const BackendContext = createContext();

export const BackendProvider = ({children}) => {
    const backendURL = "http://localhost:9001";

    return(
        <BackendContext.Provider value={backendURL}>
            {children}
        </BackendContext.Provider>
    )
}

export const BackendURL = () => {
    return useContext(BackendContext)
}