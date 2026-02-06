import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import UserContext from "../contexts/UserContext";

function RootLayout() {
	const { user } = useContext(UserContext);
	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center bg-(--bg) sm:pb-0 pb-17">
			<div className="w-full h-[10vh]">
				<Navigation profilePictureUrl={user.profileUrl ?? "user"} />
			</div>
			<main className="w-full sm:h-[88%] h-[92%] overflow-x-hidden">
				<Outlet />
			</main>
		</div>
	);
}

export default RootLayout;
