import type { Dispatch } from "react";
import * as React from "react";
import type { UserDto } from "../../web-client/src/generated/index.ts";
import type { UserAction } from "../reducers/userReducer.ts";

interface UserContextType {
	user: UserDto;
	dispatch: Dispatch<UserAction>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = React.createContext<UserContextType>(
	{} as UserContextType,
);

export default UserContext;
