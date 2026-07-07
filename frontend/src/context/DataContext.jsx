import { createContext, useContext, useState } from "react";

const DataContext = createContext(null);


export default function DataProvider({ children }) {
    const [data, setData] = useState([]);
    const [mode, setMode] = useState("Signup");
    const [user, setUser] = useState("");
    const [notifiMsg, setNotfiMsg] = useState("");
    const [notifiStatus, setNotifiStatus] = useState("close");


    return (
        <DataContext.Provider value={{
            data, setData, user, setUser, mode,
            setMode, notifiMsg, setNotfiMsg,
            notifiStatus, setNotifiStatus
        }}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within DataProvider");
    }

    return context;
}