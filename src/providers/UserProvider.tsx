import { useReducer } from "react";
import UserContext from "../contexts/UserContext.tsx";
import type { User } from "../interfaces/UserInterface.ts";
import userReducer from "../reducers/userReducer.ts";

const res = await fetch('/mocks/userResponse.json');
const data = await res.json();

const initialUser: User = {
	id: data.id,
	name: data.name,
	department: data.department,
	profileUrl: data.profileUrl,
	email: data.email,
	year: data.year,
	degree: data.degree
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, dispatch] = useReducer(userReducer, initialUser);

	return (
		<UserContext.Provider value={{ user, dispatch }}>
			{children}
		</UserContext.Provider>
	);
};
