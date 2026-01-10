import { type ReactNode, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loader";
import ProfileSidebar from "../components/ProfileSideBar";
import useGetFavourites from "../hooks/useGetFavourites";
import useGetTopSubmissions from "../hooks/useGetTopSubmissions";
import { useSubmissions } from "../hooks/useSubmissions";
import FetchedSubmission from "../pages/FetchedSubmission";
import { showError, showSuccess } from "../utils/toast";

const Home = () => {
	type HomeView = "top" | "favourite";

	const [searchParams, setSearchParams] = useSearchParams();
	const rawView = searchParams.get("view");
	const { setSubmissions } = useSubmissions();

	const view: HomeView =
		rawView === "top" || rawView === "favourite" ? rawView : "top";

	useEffect(() => {
		if (rawView !== view) {
			setSearchParams({ view }, { replace: true });
		}
	}, [rawView, view, setSearchParams]);

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

	const loading = view === "top" ? topLoading : favLoading;
	const error = view === "top" ? topError : favError;

	const handleSeeMoreFavourites = () => {
		setSearchParams({ view: "favourite" });
	};

	useEffect(() => {
		if (view === "favourite") fetchFavourites();
		else fetchTopSubmissions();
	}, [view, fetchFavourites, fetchTopSubmissions]);

	useEffect(() => {
		if (view === "favourite") setSubmissions(favouriteSubmissions ?? []);
		else setSubmissions(topSubmissions ?? []);
	}, [view, favouriteSubmissions, topSubmissions, setSubmissions]);

	const location = useLocation();

	useEffect(() => {
		if (location.state?.loggedIn) {
			showSuccess("Logged in successfully!");
			window.history.replaceState({}, "", location.pathname);
		}
	}, [location]);

	useEffect(() => {
		if (error) showError(error.message);
	}, [error]);

	let content: ReactNode;
	if (loading)
		content = (
			<div className="p-4">
				<Loader fullscreen />
			</div>
		);
	else if (error) {
		content = (
			<div className="p-4 h-full">
				<Loader />
			</div>
		);
	} else content = <FetchedSubmission />;

	return (
		<div className="w-full h-full bg-(--bg) text-(--text-heading) flex justify-center">
			<ToastContainer newestOnTop />
			<div className=" w-full h-full px-[3vmax] flex gap-[3vmax]">
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
