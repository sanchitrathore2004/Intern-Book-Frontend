import { useState, type ReactNode } from "react";
import ProfileSidebar from "../components/ProfileSideBar";
import useGetFavourites from "../hooks/useGetFavourites";
import useGetTopSubmissions from "../hooks/useGetTopSubmissions";
import FetchedSubmission from "../pages/FetchedSubmission";

const Home = () => {
  const [view, setView] = useState<"top" | "favourites">("top");

  const {
    submissions: topSubmissions,
    loading: topLoading,
    error: topError,
  } = useGetTopSubmissions();

  const {
    submissions: favouriteSubmissions,
    loading: favLoading,
    error: favError,
    fetchFavourites,
  } = useGetFavourites();

  const submissions =
    view === "top" ? topSubmissions ?? [] : favouriteSubmissions ?? [];
  const loading = view === "top" ? topLoading : favLoading;
  const error = view === "top" ? topError : favError;

  const handleSeeMoreFavourites = () => {
    setView("favourites");
    fetchFavourites();
  };

  let content: ReactNode;
  if (loading) content = <div className="p-4">Loading...</div>;
  else if (error) content = <div className="p-4">Error: {error.message}</div>;
  else content = <FetchedSubmission submissions={submissions} />;

  return (
    <div className="w-full h-full bg-(--bg) text-(--text-heading) flex justify-center">
      <div className="max-w-368 w-full h-full px-[3vmax] flex gap-[3vmax]">
        <div className="hidden md:block pt-[2vmax]">
          <ProfileSidebar onSeeMoreFavourites={handleSeeMoreFavourites} />
        </div>
        <div className="flex-1 bg-(--fore-bg) mt-4 mb-4 rounded-[1.6vmax] flex flex-col">
          <div className="flex-1 overflow-auto no-scrollbar pt-[1.5vmax] pb-[1.5vmax] px-[2.5vmax]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[3.5vmax] justify-items-center">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
