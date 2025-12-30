import UserContext from "../contexts/UserContext.tsx";
import userReducer from "../reducers/userReducer.ts";
import {useReducer} from "react";
import react from "../assets/react.svg"

import type { User } from "../interfaces/UserInterface.ts";

const initialUser: User = {
    id: 1,
    name: "Abhishek Jha",
    department:"ICE",
    profileUrl:react,
}


export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, dispatch] = useReducer(userReducer, initialUser)

    return (
        <UserContext.Provider value={{ user, dispatch }}>
            {children}
        </UserContext.Provider>
    )
}
