import { type ReactNode, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loader";
import ProfileSidebar from "../components/ProfileSideBar";
import useGetFavourites from "../hooks/useGetFavourites";
import useGetTopSubmissions from "../hooks/useGetTopSubmissions";
import FetchedSubmission from "../pages/FetchedSubmission";
import { showError, showSuccess } from "../utils/toast";

const Home = () => {
	type HomeView = "top" | "favourite";
	const [searchParams, setSearchParams] = useSearchParams();
	const view = (searchParams.get("view") as HomeView) ?? "top";

	const {
		submissions: topSubmissions,
		loading: topLoading,
		error: topError,
		fetchTopSubmissions,
	} = useGetTopSubmissions();

	const {
		submissions: favouriteSubmissions,
		loading: favLoading,
		error: favError,
		fetchFavourites,
	} = useGetFavourites();

	const submissions =
		view === "top" ? (topSubmissions ?? []) : (favouriteSubmissions ?? []);
	const loading = view === "top" ? topLoading : favLoading;
	const error = view === "top" ? topError : favError;

	const handleSeeMoreFavourites = () => {
		setSearchParams({ view: "favourite" });
	};

	useEffect(() => {
		if (view === "favourite") {
			fetchFavourites();
		} else {
			fetchTopSubmissions();
		}
	}, [view, fetchFavourites, fetchTopSubmissions]);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (location.state?.loggedIn) {
			showSuccess("Logged in successfully!");
			navigate(location.pathname, { replace: true, state: {} });
		}
	}, [location, navigate]);

	let content: ReactNode;
	if (loading)
		content = (
			<div className="p-4">
				<Loader fullscreen />
			</div>
		);
	else if (error) {
		showError(error.message);
		content = (
			<div className="p-4 h-full">
				<Loader />
			</div>
		);
	} else content = <FetchedSubmission submissions={submissions} />;

	return (
		<div className="w-full h-full bg-(--bg) text-(--text-heading) flex justify-center">
			<ToastContainer newestOnTop />
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
