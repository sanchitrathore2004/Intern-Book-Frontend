import { Route, Routes } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Profile from "../pages/Profile";
import { Submission } from "../pages/Submission.tsx";

function AppRoutes() {
	return (
		<Routes>
			<Route element={<RootLayout />}>
				<Route path="/" />
				<Route path="/profile" element={<Profile />} />
				<Route path="/submission" element={<Submission />} />
			</Route>
			<Route path="*" />
		</Routes>
	);
}

export default AppRoutes;
