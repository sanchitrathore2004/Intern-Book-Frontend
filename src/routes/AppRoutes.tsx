import { Route, Routes } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home.tsx";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import { Submission } from "../pages/Submission.tsx";
import DAuthCallback from "../pages/DauthCallback.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<DAuthCallback />} />
      <Route element={<RootLayout />}>
        <Route element={<ProtectedRoute />} >
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/submission" element={<Submission />} />
        </Route>
      </Route>
      <Route path="*" />
    </Routes>
  );
}

export default AppRoutes;
