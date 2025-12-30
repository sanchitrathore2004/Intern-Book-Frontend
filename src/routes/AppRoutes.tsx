import { Route, Routes } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home.tsx";
import Profile from "../pages/Profile";

function AppRoutes() {
	return (
		<Routes>
			<Route element={<RootLayout />}>
				<Route path="/" element={<Home />} />
				<Route path="/profile" element={<Profile />} />
			</Route>
			<Route path="*" />
		</Routes>
	);
}

export default AppRoutes;
