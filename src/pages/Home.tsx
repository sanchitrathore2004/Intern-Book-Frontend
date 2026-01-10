import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loader";
import ProfileSidebar from "../components/ProfileSideBar";
import useGetAllSubmissions from "../hooks/useGetAllSubmissions";
import useGetFavourites from "../hooks/useGetFavourites";
import useGetTopSubmissions from "../hooks/useGetTopSubmissions";
import { useSubmissions } from "../hooks/useSubmissions";
import FetchedSubmission from "../pages/FetchedSubmission";
import { showError, showSuccess } from "../utils/toast";

const Home = () => {
	type HomeView = "top" | "favourite" | "search";

	const [searchParams, setSearchParams] = useSearchParams();
	const rawView = searchParams.get("view");
	const rawIds = searchParams.get("ids");
	const { submissions, setSubmissions } = useSubmissions();
	const searchAbortRef = useRef<AbortController | null>(null);

	const view: HomeView =
		rawView === "top" || rawView === "favourite" || rawView === "search"
			? rawView
			: "top";

	const searchIds = useMemo(() => {
		if (!rawIds) return [];
		const ids = rawIds
			.split(",")
			.map((s) => Number(s.trim()))
			.filter((n) => Number.isFinite(n) && n > 0);
		return Array.from(new Set(ids));
	}, [rawIds]);

	const canonicalSearchIds = useMemo(() => {
		if (searchIds.length === 0) return null;
		return [...searchIds].sort((a, b) => a - b).join(",");
	}, [searchIds]);

	useEffect(() => {
		// Normalize URL params.
		if (view === "search") {
			if (!canonicalSearchIds) {
				setSearchParams({ view: "top" }, { replace: true });
				return;
			}
			if (rawIds !== canonicalSearchIds || rawView !== "search") {
				setSearchParams(
					{ view: "search", ids: canonicalSearchIds },
					{ replace: true },
				);
			}
			return;
		}

		// In non-search views, drop stale ids and normalize invalid views.
		if (rawIds != null || rawView !== view) {
			setSearchParams({ view }, { replace: true });
		}
	}, [canonicalSearchIds, rawIds, rawView, view, setSearchParams]);

	const {
		submissions: topSubmissions,
		loading: topLoading,
		error: topError,
		fetchTopSubmissions,
	} = useGetTopSubmissions();

	const {
		submissions: searchSubmissions,
		loading: searchLoading,
		error: searchError,
		fetchSubmissions: fetchSearchSubmissions,
	} = useGetAllSubmissions();

	const {
		submissions: favouriteSubmissions,
		loading: favLoading,
		error: favError,
		fetchFavourites,
	} = useGetFavourites();

	const loading =
		view === "top"
			? topLoading
			: view === "favourite"
				? favLoading
				: searchLoading;
	const error =
		view === "top" ? topError : view === "favourite" ? favError : searchError;

	const handleSeeMoreFavourites = () => {
		setSearchParams({ view: "favourite" });
	};

	useEffect(() => {
		if (view === "favourite") fetchFavourites();
		else if (view === "top") fetchTopSubmissions();
	}, [view, fetchFavourites, fetchTopSubmissions]);

	useEffect(() => {
		if (view !== "search") return;
		if (!canonicalSearchIds) return;
		searchAbortRef.current?.abort();
		const controller = new AbortController();
		searchAbortRef.current = controller;
		fetchSearchSubmissions(searchIds, controller);
		return () => controller.abort();
	}, [view, canonicalSearchIds, fetchSearchSubmissions, searchIds]);

	useEffect(() => {
		if (view === "favourite") setSubmissions(favouriteSubmissions ?? []);
		else if (view === "top") setSubmissions(topSubmissions ?? []);
	}, [view, favouriteSubmissions, topSubmissions, setSubmissions]);

	useEffect(() => {
		if (view !== "search") return;
		// Navigation may have already populated context from its prefetch cache.
		if (searchSubmissions.length > 0) setSubmissions(searchSubmissions);
		else if (submissions.length === 0 && canonicalSearchIds) setSubmissions([]);
	}, [
		view,
		canonicalSearchIds,
		searchSubmissions,
		submissions.length,
		setSubmissions,
	]);

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
