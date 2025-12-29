import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

function RootLayout() {
	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center bg-[#242424]">
			<div className="w-full h-[12%]">
				<Navigation profilePictureUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQn2-hFzsufsjhrUXE985YyMdX8YSYQ44kmQ&s" />
			</div>
			<main className="w-full h-[88%]">
				<Outlet />
			</main>
		</div>
	);
}

export default RootLayout;
