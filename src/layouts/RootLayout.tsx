import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

function RootLayout() {
	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center bg-(--bg)">
			<div className="w-full sm:h-[12%] h-[8%]">
				<Navigation profilePictureUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQn2-hFzsufsjhrUXE985YyMdX8YSYQ44kmQ&s" />
			</div>
			<main className="w-full sm:h-[88%] h-[92%] overflow-x-hidden">
				<Outlet />
			</main>
		</div>
	);
}

export default RootLayout;
