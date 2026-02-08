import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function AdminRoutes() {
	const { user } = useContext(UserContext);
	const isAdmin = user.userRole === "ADMIN";
	if (!isAdmin) {
		return <Navigate to="/" replace />;
	}
	return <Outlet />;
}
