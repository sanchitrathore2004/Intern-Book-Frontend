import { Bookmark, House, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SubmissionCardResponseDto } from "../../web-client/src/generated/index.ts";
import { useTheme } from "../contexts/ThemeContext.tsx";
import UserContext from "../contexts/UserContext.tsx";
import useAutoComplete from "../hooks/useAutoComplete.ts";
import useGetAllSubmissions from "../hooks/useGetAllSubmissions.ts";
import { useSubmissions } from "../hooks/useSubmissions.ts";
import { navigateWithModifiers } from "../utils/navigateWithModifiers";
import Loader from "./Loader.tsx";

const isSubmission = (
	x: SubmissionCardResponseDto | undefined | null,
): x is SubmissionCardResponseDto => x != null;

interface NavigationBarProps {
	profilePictureUrl: string;
}

function Navigation(props: NavigationBarProps) {
	const { theme, toggleTheme } = useTheme();
	const [searchOpen, setSearchOpen] = useState(false);
	const [query, setQuery] = useState("");
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
	const fetchControllerRef = useRef<AbortController | null>(null);
	const [searchCommitted, setSearchCommitted] = useState(false);
	const committedIdsRef = useRef<number[] | null>(null);
	const prefetchedByIdRef = useRef(
		new Map<number, SubmissionCardResponseDto>(),
	);
	const navigate = useNavigate();

	const { fetchSubmissions, submissions } = useGetAllSubmissions();

	const { suggestions, setSuggestions, fetchSuggestions, loading } =
		useAutoComplete();

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
		if (!query.trim()) return;

		const controller = new AbortController();
		const id = setTimeout(() => {
			fetchSuggestions(query, controller);
			setActiveIndex(0);
		}, 300);

		return () => {
			clearTimeout(id);
			controller.abort();
		};
	}, [fetchSuggestions, query]);

	// Prefetch all submissions referenced by the current suggestions
	useEffect(() => {
		const allIds = Array.from(new Set(suggestions.flatMap((s) => s.ids ?? [])));
		if (allIds.length === 0) return;

		fetchControllerRef.current?.abort();
		const controller = new AbortController();
		fetchControllerRef.current = controller;
		fetchSubmissions(allIds, controller);

		return () => controller.abort();
	}, [suggestions, fetchSubmissions]);

	// Keep a local cache of prefetched submissions.
	useEffect(() => {
		if (!submissions || submissions.length === 0) return;
		for (const submission of submissions) {
			if (submission?.id != null)
				prefetchedByIdRef.current.set(submission.id, submission);
		}
	}, [submissions]);

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

			const cached = ids
				.map((id) => prefetchedByIdRef.current.get(id))
				.filter(isSubmission);
			if (cached.length > 0) setSubmissions(cached);
		},
		[suggestions, navigate, setSubmissions],
	);

	// After commit, if some ids weren't in cache yet, fill them in when prefetch completes.
	// biome-ignore lint/correctness/useExhaustiveDependencies: <this effect depends on submissions>
	useEffect(() => {
		if (!searchCommitted) return;
		const ids = committedIdsRef.current;
		if (!ids || ids.length === 0) return;
		const cached = ids
			.map((id) => prefetchedByIdRef.current.get(id))
			.filter(isSubmission);
		if (cached !== undefined && cached.length === ids.length)
			setSubmissions(cached);
	}, [searchCommitted, submissions, setSubmissions]);

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
				<div
					style={{
						fontFamily: "GoldmanSansLt",
						fontSize: "1.5rem",
					}}
					className="h-full hidden sm:flex items-center pt-[0.8vmax] text-(--text-heading)"
				>
					Intern Book
				</div>
			</div>
			{/* Utility buttons */}
			<div className="w-full h-full flex items-center justify-end gap-[1.5vmax] pr-[1.5vmax]">
				<div className="relative hidden sm:flex h-full items-center">
					<input
						ref={desktopInputRef}
						value={query}
						onChange={(e) => {
							const v = e.target.value;
							setQuery(v);
							setSearchCommitted(false);
							setShowDropdown(!!v.trim());
							if (!v.trim()) setSuggestions([]);
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
				<button
					type="button"
					tabIndex={0}
					onClick={() => setSearchOpen(true)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") setSearchOpen(true);
					}}
					className="h-[50%] w-fit aspect-square
            bg-(--bg)
            border-[0.5px] border-(--border-color)
            rounded-[0.6vmax]
            sm:hidden flex justify-center items-center
            cursor-text
            transition-all duration-200
            hover:bg-(--fore-bg)"
				>
					<Search className="text-(--text-light) w-full" />
				</button>
				<button
					type="button"
					onClick={onClickFavourites}
					className="h-[50%] w-fit aspect-square
            bg-(--bg)
            border-[0.5px] border-(--border-color)
            rounded-[0.6vmax]
            flex justify-center items-center
            cursor-pointer
            transition-all duration-200
            hover:bg-(--fore-bg)
			"
				>
					<Bookmark className="text-(--accent) w-full" fill="var(--accent)" />
				</button>

				<button
					type="button"
					onClick={toggleTheme}
					className="h-[50%] w-fit aspect-square
                    bg-(--bg)
                    border-[0.5px] border-(--border-color)
                    rounded-[0.6vmax]
                    flex justify-center items-center
                    cursor-pointer
                    transition-all duration-200
                    hover:bg-(--fore-bg)
					"
				>
					{theme === "dark" ? (
						<Sun className="w-full" color="var(--accent)" />
					) : (
						<Moon className="w-full" color="var(--accent)" />
					)}
				</button>
				<div ref={profileRef} className="relative h-[50%] w-fit aspect-square">
					<button
						type="button"
						onClick={() => setProfileDropDown(!showProfileDropDown)}
						onKeyDown={(e) => {
							if (e.key === "Escape") setProfileDropDown(false);
						}}
						aria-haspopup="menu"
						aria-expanded={showProfileDropDown}
						className="h-full w-full aspect-square bg-(--bg) rounded-[0.6vmax]"
					>
						<img
							fetchPriority="high"
							className="h-full w-full object-cover object-center 
                    bg-(--bg)
                    border-[0.5px] border-(--border-color)
                    rounded-[0.6vmax]
                    flex justify-center items-center
                    cursor-pointer
                    transition-all duration-200
                    hover:bg-(--fore-bg)"
							src={props.profilePictureUrl}
							alt=""
						/>
					</button>
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
									if (!v.trim()) setSuggestions([]);
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
