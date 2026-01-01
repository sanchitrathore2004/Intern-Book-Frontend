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
import SubmissionForm from "../pages/SubmissionForm.tsx";
import useRestoreUser from "../hooks/useRestoreUser.ts";

function AppRoutes() {
	useRestoreUser();
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/callback" element={<DAuthCallback />} />
			<Route element={<RootLayout />}>
				<Route element={<ProtectedRoute />}>
					<Route path="/home" element={<Home />} />
					<Route path="/profile/:user_id" element={<Profile />} />
					<Route path="/submission/:submission_id" element={<Submission />} />
					{/*·companyId·will·be·removed·from·here·after·final·integration·*/}
					{/* Dont remove company_id I will use it to direct user from submission to company page */}
					<Route path="/company/:company_id" element={<Company />} />
					<Route path="/submissionForm" element={<SubmissionForm/>} />
				</Route>
			</Route>
			<Route path="*" element={<ErrorPage />} />
		</Routes>
	);
}

export default AppRoutes;
