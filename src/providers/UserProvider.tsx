import { useReducer } from "react";
import UserContext from "../contexts/UserContext.tsx";
import userReducer from "../reducers/userReducer.ts";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, dispatch] = useReducer(userReducer, {});
	return (
		<UserContext.Provider value={{ user, dispatch }}>
			{children}
		</UserContext.Provider>
	);
};
