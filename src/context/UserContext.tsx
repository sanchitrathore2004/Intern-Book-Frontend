import type { Dispatch } from "react";
import type { UserAction } from "../reducers/userReducer.ts";
import * as React from "react";
import type { User } from "../interfaces/UserInterface.ts";

interface UserContextType {
	user: User;
	dispatch: Dispatch<UserAction>;
}

export const UserContext = React.createContext<UserContextType>(
	{} as UserContextType,
);

export default UserContext;
