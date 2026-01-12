import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import type { SubmissionCardResponseDto } from "../../web-client/src/generated";
import Loader from "../components/Loader";
import ProfileSidebar from "../components/ProfileSideBar";
import useGetAllSubmissions from "../hooks/useGetAllSubmissions";
import useGetFavourites from "../hooks/useGetFavourites";
import { useInfiniteTopSubmission } from "../hooks/useGetTopSubmissions";
import { useSubmissions } from "../hooks/useSubmissions";
import FetchedSubmission from "../pages/FetchedSubmission";
import { showError, showSuccess } from "../utils/toast";

const Home = () => {
	type HomeView = "top" | "favourite" | "search";

	const [searchParams, setSearchParams] = useSearchParams();
	const rawView = searchParams.get("view");
	const rawIds = searchParams.get("ids");
	const view: HomeView =
		rawView === "top" || rawView === "favourite" || rawView === "search"
			? rawView
			: "top";

	const { submissions, setSubmissions } = useSubmissions();
	const searchAbortRef = useRef<AbortController | null>(null);

	const {
		data: topData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: topLoading,
		isError: topIsError,
		error: topError,
	} = useInfiniteTopSubmission();

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
		if (rawIds != null || rawView !== view) {
			setSearchParams({ view }, { replace: true });
		}
	}, [canonicalSearchIds, rawIds, rawView, view, setSearchParams]);

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

	const effectiveError =
		view === "top"
			? topIsError
				? topError
				: null
			: view === "favourite"
				? favError
				: searchError;

	useEffect(() => {
		if (effectiveError) showError(effectiveError.message);
	}, [effectiveError]);

	useEffect(() => {
		if (view === "favourite") fetchFavourites();
	}, [view, fetchFavourites]);

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
		if (view !== "top") return;
		if (!topData) return;
		const merged = topData.pages
			.flatMap((p) => p.items)
			.filter(Boolean) as SubmissionCardResponseDto[];
		setSubmissions(merged);
	}, [view, topData, setSubmissions]);

	useEffect(() => {
		if (view === "favourite") setSubmissions(favouriteSubmissions ?? []);
	}, [view, favouriteSubmissions, setSubmissions]);

	useEffect(() => {
		if (view !== "search") return;

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

	const loaderRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (view !== "top") return;
		if (!loaderRef.current) return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		});

		observer.observe(loaderRef.current);
		return () => observer.disconnect();
	}, [view, hasNextPage, isFetchingNextPage, fetchNextPage]);

	let content: ReactNode;
	if (loading)
		content = (
			<div className="p-4">
				<Loader fullscreen />
			</div>
		);
	else if (effectiveError) {
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
					<ProfileSidebar
						onSeeMoreFavourites={() => setSearchParams({ view: "favourite" })}
					/>
				</div>
				<div className="flex-1 bg-(--fore-bg) mt-4 mb-4 rounded-[1.6vmax] flex flex-col">
					<div className="flex-1 overflow-auto no-scrollbar pt-[1.5vmax] pb-[1.5vmax] px-[2.5vmax]">
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[3.5vmax] justify-items-center">
							{content}
						</div>

						{view === "top" && hasNextPage && (
							<div
								ref={loaderRef}
								className="w-full h-16 flex justify-center items-center"
							>
								{isFetchingNextPage && <Loader />}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
