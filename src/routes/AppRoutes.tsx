import { Route, Routes } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Company from "../pages/Company.tsx";
import DAuthCallback from "../pages/DauthCallback.tsx";
import ErrorPage from "../pages/ErrorPage.tsx";
import Home from "../pages/Home.tsx";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Submission from "../pages/Submission.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/callback" element={<DAuthCallback />} />
			<Route element={<RootLayout />}>
				<Route element={<ProtectedRoute />}>
					<Route path="/home" element={<Home />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/submission" element={<Submission />} />
					{/*·companyId·will·be·removed·from·here·after·final·integration·*/}
					<Route path="/company" element={<Company companyId={11} />} />
				</Route>
			</Route>
			<Route path="*" />
		</Routes>
	);
}

export default AppRoutes;
