import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, House, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SubmissionCardResponseDto } from "../../web-client/src/generated/index.ts";
import { useTheme } from "../contexts/ThemeContext.tsx";
import UserContext from "../contexts/UserContext.tsx";
import useAutoComplete from "../hooks/useAutoComplete.ts";
import { useSubmissions } from "../hooks/useSubmissions.ts";
import {
	fetchSubmissionsByIds,
	submissionsByIdsKey,
} from "../hooks/useSubmissionsByIds.ts";
import { navigateWithModifiers } from "../utils/navigateWithModifiers";
import Loader from "./Loader.tsx";

interface NavigationBarProps {
	profilePictureUrl: string;
}

function Navigation(props: NavigationBarProps) {
	const { theme, toggleTheme } = useTheme();
	const [searchOpen, setSearchOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showProfileDropDown, setProfileDropDown] = useState(false);
	const profileRef = useRef<HTMLDivElement | null>(null);
	const desktopInputRef = useRef<HTMLInputElement | null>(null);
	const modalInputRef = useRef<HTMLInputElement | null>(null);
	const desktopDropdownRef = useRef<HTMLUListElement | null>(null);
	const modalDropdownRef = useRef<HTMLUListElement | null>(null);
	const { user } = useContext(UserContext);
	const { setSubmissions } = useSubmissions();
	const [searchCommitted, setSearchCommitted] = useState(false);
	const committedIdsRef = useRef<number[] | null>(null);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const location = useLocation();
	const [view, setView] = useState<string | null>(null);

	// Get the view of the current page using search
	const getViewFromLocationSearch = useCallback((search: string): string => {
		const view = search.split("=")[1];
		return view;
	}, []);

	// Get the view of the current page using pathname
	const getViewFromLocationPathname = useCallback(
		(pathname: string): string => {
			const segments = pathname.split("/").filter(Boolean); // removes empty strings
			return segments[0] || "home"; // default to "home" if no segment
		},
		[],
	);

	// Listen for the change in location
	useEffect(() => {
		let view = null;
		if (location.search.length === 0) {
			view = getViewFromLocationPathname(location.pathname);
		} else {
			view = getViewFromLocationSearch(location.search);
		}
		setView(view);
	}, [
		location,
		location.search,
		getViewFromLocationPathname,
		getViewFromLocationSearch,
	]);

	const { suggestions, loading } = useAutoComplete(
		debouncedQuery,
		showDropdown && debouncedQuery.trim().length > 0,
	);

	// Keep dropdown scroll in sync with keyboard navigation
	useEffect(() => {
		if (!showDropdown || suggestions.length === 0) return;

		const selector = `[data-suggestion-idx="${activeIndex}"]`;
		const desktopActive =
			desktopDropdownRef.current?.querySelector<HTMLElement>(selector);
		const modalActive =
			modalDropdownRef.current?.querySelector<HTMLElement>(selector);

		(desktopActive ?? modalActive)?.scrollIntoView({ block: "nearest" });
	}, [activeIndex, showDropdown, suggestions.length]);

	// debounce + fetch suggestions
	useEffect(() => {
		const trimmed = query.trim();

		if (!trimmed || trimmed.length === 0) {
			return;
		}

		const id = setTimeout(() => {
			setDebouncedQuery(trimmed);
			setActiveIndex(0);
		}, 300);

		return () => {
			clearTimeout(id);
		};
	}, [query]);

	// Prefetch all submissions referenced by the current suggestions
	useEffect(() => {
		const allIds = Array.from(new Set(suggestions.flatMap((s) => s.ids ?? [])));
		if (allIds.length === 0) return;

		queryClient.prefetchQuery({
			queryKey: submissionsByIdsKey(allIds),
			queryFn: ({ signal }) =>
				fetchSubmissionsByIds({ submissionIds: allIds, signal }),
			staleTime: 2 * 60 * 1000,
		});
	}, [suggestions, queryClient]);

	const commitSearch = useCallback(
		(word: string) => {
			const selected = suggestions.find((s) => (s.word ?? "") === word);
			const ids = Array.from(new Set(selected?.ids ?? []))
				.filter((n) => Number.isFinite(n) && n > 0)
				.sort((a, b) => a - b);
			if (ids.length === 0) return;

			committedIdsRef.current = ids;
			setSearchCommitted(true);
			navigate(`/home?view=search&ids=${ids.join(",")}`);

			const cachedList = queryClient.getQueryData<SubmissionCardResponseDto[]>(
				submissionsByIdsKey(ids),
			);
			if (cachedList && cachedList.length > 0) setSubmissions(cachedList);
		},
		[suggestions, navigate, queryClient, setSubmissions],
	);

	// After commit, if some ids weren't in cache yet, fill them in when prefetch completes.
	useEffect(() => {
		if (!searchCommitted) return;
		const ids = committedIdsRef.current;
		if (!ids || ids.length === 0) return;
		const cachedList = queryClient.getQueryData<SubmissionCardResponseDto[]>(
			submissionsByIdsKey(ids),
		);
		if (cachedList && cachedList.length > 0) setSubmissions(cachedList);
	}, [searchCommitted, queryClient, setSubmissions]);

	const onSelectSuggestion = useCallback(
		(suggestion: string) => {
			setQuery(suggestion);
			setShowDropdown(false);
			setSearchOpen(false);
			commitSearch(suggestion);
		},
		[commitSearch],
	);

	useEffect(() => {
		function onDoc(e: MouseEvent) {
			const target = e.target as Node | null;
			const clickedInsideDesktop = desktopInputRef.current?.contains(target);
			const clickedInsideModal = modalInputRef.current?.contains(target);
			if (!clickedInsideDesktop && !clickedInsideModal) {
				setShowDropdown(false);
			}
			if (profileRef.current && !profileRef.current.contains(target)) {
				setProfileDropDown(false);
			}
		}
		document.addEventListener("click", onDoc);
		return () => document.removeEventListener("click", onDoc);
	}, []);

	const onClickFavourites = (e: React.MouseEvent) => {
		navigateWithModifiers(e, navigate, "/home?view=favourite");
	};

	return (
		<div className="w-full h-full flex justify-between items-center border-b border-(--line-color)">
			{/* Logo & Name */}
			<div className="w-full h-full flex items-center gap-[1.7vmax]">
				<button
					type="button"
					onClick={(e) => {
						if (navigateWithModifiers(e, navigate, "/home?view=top")) return;
						setQuery("");
					}}
					className="h-full w-fit flex items-center pl-[1.5vmax] cursor-pointer"
				>
					<img
						className="h-[3.7vmax]"
						src={
							theme === "light"
								? "/assets/images/app_icon_dark.png"
								: "/assets/images/app_icon_light.png"
						}
						alt=""
					/>
				</button>
				<button
					type="button"
					style={{
						fontFamily: "GoldmanSansLt",
						fontSize: "1.5rem",
					}}
					onClick={(e) => {
						if (navigateWithModifiers(e, navigate, "/home?view=top")) return;
						setQuery("");
					}}
					className="h-full hidden sm:flex items-center pt-[0.8vmax] text-(--text-heading) cursor-pointer"
				>
					Intern Book
				</button>
			</div>
			{/* Utility buttons */}
			<div className="w-full h-full flex items-center justify-end gap-[1.5vmax] pr-[1.5vmax]">
				<div className="relative hidden sm:flex h-full items-center -mt-3.5">
					<input
						ref={desktopInputRef}
						value={query}
						onChange={(e) => {
							const v = e.target.value;
							setQuery(v);
							setSearchCommitted(false);
							setShowDropdown(!!v.trim());
						}}
						onFocus={() => setShowDropdown(true)}
						onKeyDown={(e) => {
							if (e.key === "ArrowDown") {
								setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
								e.preventDefault();
							} else if (e.key === "ArrowUp") {
								setActiveIndex((i) => Math.max(i - 1, 0));
								e.preventDefault();
							} else if (e.key === "Enter") {
								if (activeIndex >= 0 && suggestions[activeIndex]) {
									const word = suggestions[activeIndex].word ?? "";
									setQuery(word);
									setShowDropdown(false);
									commitSearch(word);
								}
							} else if (e.key === "Escape") {
								setShowDropdown(false);
							}
						}}
						type="text"
						placeholder="Search"
						className="text-[0.75em] md:text-[0.8em] xl:text-[1.25em] text-(--text-heading) 
            placeholder-(--text-light)
            h-[50%] w-fit aspect-auto
            bg-(--bg) 
            border-[0.5px] border-(--border-color) rounded-[0.6vmax] 
            pl-[1vmax] pr-[1vmax] 
            hidden 
            sm:flex items-center 
            justify-center 
            cursor-text 
            transition-all duration-200 
            hover:bg-(--fore-bg)
            focus:outline-none focus:ring-0 focus-visible:outline-none"
					/>

					{showDropdown && suggestions.length > 0 && (
						<ul
							ref={desktopDropdownRef}
							className="absolute flex flex-col p-[0.5vmax] top-[7vh] left-0 mt-[0.4vmax] w-full max-h-56 overflow-auto bg-(--bg) border-[0.5px] border-(--border-color) rounded-md shadow-sm z-20 text-md 2xl:text-lg"
						>
							{suggestions.map((s, idx) => (
								<li
									key={s.word}
									data-suggestion-idx={idx}
									onMouseDown={(e) => {
										e.preventDefault();
										onSelectSuggestion(s.word ?? "");
									}}
									onMouseEnter={() => setActiveIndex(idx)}
									className={`px-[0.8vmax] py-[0.6vmax] cursor-pointer rounded-md ${
										idx === activeIndex ? "bg-(--fore-bg)" : ""
									}`}
								>
									{loading ? <Loader size={10} /> : s.word}
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="flex flex-col items-center justify-center h-full sm:hidden">
					<button
						type="button"
						tabIndex={0}
						onClick={() => setSearchOpen(true)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") setSearchOpen(true);
						}}
						className={`
			h-10 w-10
			rounded-[0.6vmax]
			flex justify-center items-center
			cursor-text
			transition-all duration-200 ease-out
			bg-(--bg)
			border-[0.5px] border-(--border-color)
			hover:bg-(--fore-bg)
		`}
					>
						<Search className="w-6 h-6 text-(--text-light)" />
					</button>

					<span className="sm:visible hidden mt-0.5 text-[0.75rem] font-medium leading-none text-(--muted-text)">
						Search
					</span>
				</div>

				<div className="flex flex-col items-center justify-center h-full">
					<button
						type="button"
						onClick={toggleTheme}
						className={`
			h-10 w-10
			rounded-[0.6vmax]
			flex justify-center items-center
			cursor-pointer
			transition-all duration-200 ease-out
			bg-(--bg)
			border-[0.5px] border-(--border-color)
			hover:bg-(--fore-bg)
		`}
					>
						{theme === "dark" ? (
							<Sun className="w-6 h-6" color="var(--accent)" />
						) : (
							<Moon className="w-6 h-6" color="var(--accent)" />
						)}
					</button>

					<span className="mt-1 hidden sm:block text-[0.75rem] font-medium leading-none text-(--muted-text)">
						{theme.charAt(0).toLocaleUpperCase() + theme.substring(1)}
					</span>
				</div>

				<div className="flex flex-col items-center justify-center h-full">
					<button
						type="button"
						onClick={onClickFavourites}
						className={`
			h-10 w-10
			rounded-[0.6vmax]
			flex justify-center items-center
			cursor-pointer
			transition-all duration-200 ease-out

			${
				view === "favourite"
					? `
					bg-(--accent-bg)
					border border-(--accent)
					ring ring-(--accent)/50
					shadow-[0_0_3px_var(--accent)]
					scale-105
				`
					: `
					bg-(--bg)
					border-[0.5px] border-(--border-color)
					hover:bg-(--fore-bg)
				`
			}
		`}
					>
						<Bookmark
							className={`
				w-6 h-6
				transition-all duration-200
				${view === "favourite" ? "text-(--accent) scale-110" : "text-(--accent)"}
			`}
							fill="var(--accent)"
						/>
					</button>

					<span
						className={`
			mt-1 hidden sm:block 
			text-[0.75rem] font-medium leading-none
			transition-colors duration-200
			${view === "favourite" ? "text-(--accent)" : "text-(--muted-text)"}
		`}
					>
						Favourites
					</span>
				</div>

				<div className="flex flex-col items-center justify-center h-full">
					<button
						type="button"
						onClick={(e) => {
							if (navigateWithModifiers(e, navigate, "/home?view=top")) return;
							setQuery("");
						}}
						className={`
			w-10 h-10
			rounded-[0.6vmax]
			flex justify-center items-center
			cursor-pointer
			transition-all duration-200 ease-out

			${
				view === "top"
					? `
					bg-(--accent-bg)
					border border-(--accent)
					ring ring-(--accent)/50
					shadow-[0_0_3px_var(--accent)]
					scale-105
				`
					: `
					bg-(--bg)
					border-[0.5px] border-(--border-color)
					hover:bg-(--fore-bg)
				`
			}
		`}
					>
						<House
							className={`
				w-6 h-6
				transition-all duration-200
				${view === "top" ? "text-(--accent) scale-110" : "text-(--accent)"}
			`}
						/>
					</button>

					<span
						className={`
			mt-1 hidden sm:block 
			text-[0.75rem] font-medium leading-none
			transition-colors duration-200
			${view === "top" ? "text-(--accent)" : "text-(--muted-text)"}
		`}
					>
						Home
					</span>
				</div>

				<div ref={profileRef} className="relative h-[50%] w-fit aspect-square">
					<div ref={profileRef} className="relative h-full">
						<div className="flex flex-col items-center justify-center h-full">
							<button
								type="button"
								onClick={() => setProfileDropDown(!showProfileDropDown)}
								onKeyDown={(e) => {
									if (e.key === "Escape") setProfileDropDown(false);
								}}
								aria-haspopup="menu"
								aria-expanded={showProfileDropDown}
								className="h-10 w-10 rounded-[0.6vmax]"
							>
								<img
									fetchPriority="high"
									src={props.profilePictureUrl}
									alt=""
									className={`
					h-full w-full object-cover object-center
					rounded-[0.6vmax]
					cursor-pointer
					transition-all duration-200 ease-out

					${
						view === "profile"
							? `
							bg-(--accent-bg)
							border border-(--accent)
							ring ring-(--accent)/50
							shadow-[0_0_5px_var(--accent)]
							scale-105
						`
							: `
							bg-(--bg)
							border-[0.5px] border-(--border-color)
							hover:bg-(--fore-bg)
						`
					}
				`}
								/>
							</button>

							<span
								className={`
				mt-1 hidden sm:block
				text-[0.75rem] font-medium leading-none tracking-wide
				transition-colors duration-200
				${view === "profile" ? "text-(--accent)" : "text-(--muted-text)"}
			`}
							>
								Profile
							</span>
						</div>
					</div>

					{showProfileDropDown && (
						<ul className="absolute flex flex-col p-[0.5vmax] text-md 2xl:text-lg top-[5.2vh] min-w-30 w-fit 2xl:min-w-[9vw] right-0 max-h-56 overflow-auto bg-(--bg) border-[0.5px] border-(--border-color) rounded-md shadow-sm z-20">
							<li
								onMouseDown={(e) => {
									e.preventDefault();
									if (navigateWithModifiers(e, navigate, "/home")) return;
									setProfileDropDown(false);
								}}
								className="hover:cursor-pointer p-1 hover:bg-(--fore-bg) rounded-md"
							>
								<div className="flex items-center">
									<House className="text-(--accent) w-6 h-6 2xl:w-7 2xl:h-7" />
									<div className="ml-1">Home</div>
								</div>
							</li>
							<li
								onMouseDown={(e) => {
									e.preventDefault();
									if (navigateWithModifiers(e, navigate, `/profile/${user.id}`))
										return;
									setProfileDropDown(false);
								}}
								className="hover:cursor-pointer p-1 hover:bg-(--fore-bg) rounded-md"
							>
								<div className="flex items-center">
									<User className="text-(--accent) w-6 h-6 2xl:w-7 2xl:h-7" />
									<div className="ml-1">Profile</div>
								</div>
							</li>
							<li
								onMouseDown={(e) => {
									e.preventDefault();
									setProfileDropDown(false);
									localStorage.removeItem("token");
									navigate("/", { replace: true });
								}}
								className="p-1 hover:cursor-pointer hover:bg-(--fore-bg) rounded-md"
							>
								<div className="flex items-center">
									<LogOut className="text-(--accent) w-6 h-6 2xl:w-7 2xl:h-7" />
									<div className="ml-1">Log out</div>
								</div>
							</li>
						</ul>
					)}
				</div>
			</div>

			{searchOpen && (
				<div className="fixed inset-0 z-50 flex items-start justify-center">
					<button
						type="button"
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => setSearchOpen(false)}
					/>
					<div
						className="flex justify-center items-center 
		  	z-10 h-[7vh] w-[70%] max-w-lg pl-[2vmax] pr-[2vmax]
			bg-(--bg) rounded-[0.8vmax]
			mt-[10vh]
			"
					>
						<div className="flex w-full relative">
							<input
								ref={modalInputRef}
								value={query}
								onChange={(e) => {
									const v = e.target.value;
									setQuery(v);
									setSearchCommitted(false);
									setShowDropdown(!!v.trim());
								}}
								onKeyDown={(e) => {
									if (e.key === "ArrowDown") {
										setActiveIndex((i) =>
											Math.min(i + 1, suggestions.length - 1),
										);
										e.preventDefault();
									} else if (e.key === "ArrowUp") {
										setActiveIndex((i) => Math.max(i - 1, 0));
										e.preventDefault();
									} else if (e.key === "Enter") {
										if (activeIndex >= 0 && suggestions[activeIndex]) {
											const word = suggestions[activeIndex].word ?? "";
											setQuery(word);
											setShowDropdown(false);
											setSearchOpen(false);
											commitSearch(word);
										}
									} else if (e.key === "Escape") {
										setShowDropdown(false);
										setSearchOpen(false);
									}
								}}
								type="text"
								placeholder="Search"
								className="text-[0.75em] md:text-[0.8em] xl:text-[1.25em] text-(--text-heading) 
              			placeholder-(--text-light)
              			w-full
                		p-[0.75vmax]
              			bg-(--bg) 
              			border-[0.5px] border-(--border-color) rounded-[0.6vmax]
              			cursor-text 
              			transition-all duration-200 
              			hover:bg-(--fore-bg)
              			focus:outline-none focus:ring-0 focus-visible:outline-none"
							/>

							{showDropdown && suggestions.length > 0 && (
								<ul
									ref={modalDropdownRef}
									className="absolute flex flex-col p-[0.5vmax] left-0 top-[4vh] mt-2 w-full max-h-56 overflow-auto bg-(--bg) border-[0.5px] border-(--border-color) rounded-md shadow-sm z-30"
								>
									{suggestions.map((s, idx) => (
										<li
											key={s.word}
											data-suggestion-idx={idx}
											onMouseDown={(e) => {
												e.preventDefault();
												onSelectSuggestion(s.word ?? "");
											}}
											onMouseEnter={() => setActiveIndex(idx)}
											className={`px-[0.8vmax] py-[0.6vmax] cursor-pointer rounded-md ${
												idx === activeIndex ? "bg-[rgba(255,255,255,0.04)]" : ""
											}`}
										>
											{loading ? <Loader size={10} /> : s.word}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Navigation;
