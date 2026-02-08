import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import type { SubmissionCardResponseDto } from "../../web-client/src/generated";
import Loader from "../components/Loader";
import ProfileSidebar from "../components/ProfileSideBar";
import useGetFavourites from "../hooks/useGetFavourites";
import { useInfiniteTopSubmission } from "../hooks/useGetTopSubmissions";
import { useSubmissions } from "../hooks/useSubmissions";
import { useSubmissionsByIds } from "../hooks/useSubmissionsByIds";
import FetchedSubmission from "../pages/FetchedSubmission";
import { homeNavState } from "../utils/homeNavState";
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

	const searchAbortRef = useRef<AbortController | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const homeKey = `home-${view}`;

	const { submissions, setSubmissions } = useSubmissions();

	const {
		data: topData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: topLoading,
		isError: topIsError,
		error: topError,
	} = useInfiniteTopSubmission();

	const {
		submissions: favouriteSubmissions,
		loading: favLoading,
		error: favError,
		fetchFavourites,
	} = useGetFavourites();

	// save scroll implement
	useEffect(() => {
		const saved = homeNavState.get();
		if (!saved) return;
		if (saved.key !== homeKey) return;
		if (view !== "top") return;
		if (!topData) return;
		if (
			topData.pages.length < saved.pageCount &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [homeKey, view, topData, hasNextPage, isFetchingNextPage, fetchNextPage]);

	useEffect(() => {
		const saved = homeNavState.get();
		if (!saved) return;
		if (saved.key !== homeKey) return;
		if (view === "top") {
			if (!topData) return;
			if (topData.pages.length < saved.pageCount) return;
		}
		if (view === "favourite") {
			if (submissions.length === 0) return;
		}
		if (view === "search") {
			if (submissions.length === 0) return;
		}
		const el = scrollRef.current;
		if (!el) return;
		requestAnimationFrame(() => {
			el.scrollTop = saved.scrollTop;
		});
		homeNavState.clear();
	}, [homeKey, view, topData, submissions.length]);

	const getHomeNavState = () => ({
		key: homeKey,
		scrollTop: scrollRef.current?.scrollTop ?? 0,
		pageCount: view === "top" ? (topData?.pages.length ?? 1) : 1,
	});

	const searchIds = useMemo(() => {
		if (!rawIds) return [];
		const ids = rawIds
			.split(",")
			.map((s) => Number(s.trim()))
			.filter((n) => Number.isFinite(n) && n > 0);
		return Array.from(new Set(ids));
	}, [rawIds]);

	const canonicalSearchIds: string | null = useMemo(() => {
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
		data: searchSubmissions,
		isLoading: searchLoading,
		error: searchError,
	} = useSubmissionsByIds(searchIds, { enabled: view === "search" });

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
		if (view !== "favourite") return;
		if (favLoading) return;

		setSubmissions(favouriteSubmissions ?? []);
	}, [view, favLoading, favouriteSubmissions, setSubmissions]);

	useEffect(() => {
		if (view === "favourite") {
			fetchFavourites();
		}
	}, [view, fetchFavourites]);

	useEffect(() => {
		if (view !== "search") return;
		if (!canonicalSearchIds) return;
		searchAbortRef.current?.abort();
		searchAbortRef.current = new AbortController();
		const controller = new AbortController();
		searchAbortRef.current = controller;

		return () => searchAbortRef.current?.abort();
	}, [view, canonicalSearchIds]);

	useEffect(() => {
		if (view !== "top") return;
		if (!topData) return;
		const merged = topData.pages
			.flatMap((p) => p.items)
			.filter(Boolean) as SubmissionCardResponseDto[];
		setSubmissions(merged);
	}, [view, topData, setSubmissions]);

	useEffect(() => {
		if (view !== "search") return;
		if (searchSubmissions && searchSubmissions.length > 0)
			setSubmissions(searchSubmissions);
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
	} else content = <FetchedSubmission getHomeNavState={getHomeNavState} />;

	return (
		<div className="w-full h-full bg-(--bg) text-(--text-heading) flex justify-center">
			<ToastContainer newestOnTop />
			<div className=" w-full h-full px-[3vmax] flex flex-col sm:flex-row gap-[3vmax]">
				<div className="md:block pt-[2vmax]">
					<ProfileSidebar
						onSeeMoreFavourites={() => setSearchParams({ view: "favourite" })}
					/>
				</div>
				<div className="flex-1 bg-(--fore-bg) mt-4 mb-4 rounded-[1.6vmax] flex flex-col">
					<div
						ref={scrollRef}
						className="flex-1 overflow-auto no-scrollbar pt-[1.5vmax] pb-[1.5vmax] px-[2.5vmax]"
					>
						<div className="grid grid-cols-1 xl:grid-cols-3 gap-x-[3.5vmax] gap-[1.5vmax] justify-items-center">
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
