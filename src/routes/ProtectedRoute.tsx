import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loggedIn = !!token;

  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
