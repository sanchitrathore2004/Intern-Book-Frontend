import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/Loader";
import UserContext from "../contexts/UserContext";

export default function AdminRoutes() {
	const { user } = useContext(UserContext);

	if (user.userRole === undefined) {
		return <Loader fullscreen />;
	}

	const isAdmin = user.userRole === "ADMIN";
	if (!isAdmin) {
		return <Navigate to="/home" />;
	}
	return <Outlet />;
}
