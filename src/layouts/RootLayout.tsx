import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";

function RootLayout() {
  const { user } = useContext(UserContext);
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-(--bg)">
      <div className="w-full h-[10vh]">
        <Navigation
          profilePictureUrl={
            user.profileUrl ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQn2-hFzsufsjhrUXE985YyMdX8YSYQ44kmQ&s"
          }
        />
      </div>
      <main className="w-full sm:h-[88%] h-[92%] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
