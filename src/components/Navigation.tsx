import { Bookmark, Moon, Search, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import darkAppIcon from "../assets/images/app_icon_dark.png";
import lightAppIcon from "../assets/images/app_icon_light.png";
import { useTheme } from "../contexts/ThemeContext.tsx";

interface SuggestionResponse {
	suggestion: string;
	submissionIds: number[];
}

interface NavigationBarProps {
	profilePictureUrl: string;
}

function Navigation(props: NavigationBarProps) {
	const { theme, toggleTheme } = useTheme();
	const [searchOpen, setSearchOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [showDropdown, setShowDropdown] = useState(false);
	const desktopInputRef = useRef<HTMLInputElement | null>(null);
	const modalInputRef = useRef<HTMLInputElement | null>(null);
	const navigate = useNavigate();

	// debounce + fetch suggestions
	useEffect(() => {
		if (!query.trim()) return;

		const controller = new AbortController();
		const id = setTimeout(async () => {
			try {
				const res = await fetch(`/mocks/suggestion.json`, {
					signal: controller.signal,
				});
				const data = await res.json();
				if (Array.isArray(data)) {
					const filtered = data
						.map((item: SuggestionResponse) => item.suggestion)
						.filter((s: string) =>
							s.toLowerCase().includes(query.toLowerCase()),
						);
					setSuggestions(filtered);
				} else {
					setSuggestions([]);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				if (err?.name !== "AbortError") setSuggestions([]);
			}
		}, 300);

		return () => {
			clearTimeout(id);
			controller.abort();
		};
	}, [query]);

	// close dropdown when clicking outside
	useEffect(() => {
		function onDoc(e: MouseEvent) {
			const target = e.target as Node | null;
			if (
				desktopInputRef.current &&
				!desktopInputRef.current.contains(target) &&
				modalInputRef.current &&
				!modalInputRef.current.contains(target)
			) {
				setShowDropdown(false);
			}
		}
		document.addEventListener("click", onDoc);
		return () => document.removeEventListener("click", onDoc);
	}, []);

	return (
		<div className="w-full h-full flex justify-between items-center border-b border-(--line-color)">
			{/* Logo & Name */}
			<div className="w-full h-full flex items-center gap-[1.7vmax]">
				<button
					type="button"
					onClick={() => navigate("/home")}
					className="h-full w-fit flex items-center pl-[1.5vmax] cursor-pointer"
				>
					<img
						className="h-[3.7vmax]"
						src={theme === "light" ? darkAppIcon : lightAppIcon}
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
									setQuery(suggestions[activeIndex]);
									setShowDropdown(false);
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
						<ul className="absolute top-11 left-0 mt-[0.4vmax] w-[18vmax] max-h-56 overflow-auto bg-(--bg) border-[0.5px] border-(--border-color) rounded-md shadow-sm z-20">
							{suggestions.map((s, idx) => (
								<li
									key={s}
									onMouseDown={(e) => {
										e.preventDefault();
										setQuery(s);
										setShowDropdown(false);
									}}
									onMouseEnter={() => setActiveIndex(idx)}
									className={`px-[0.8vmax] py-[0.6vmax] cursor-pointer ${
										idx === activeIndex ? "bg-(--fore-bg)" : ""
									}`}
								>
									{s}
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
				<div
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
				</div>
				<button
					type="button"
					onClick={() => navigate("/profile")}
					className="h-[50%] w-fit aspect-square bg-(--bg) rounded-[0.6vmax]"
				>
					<img
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
											setQuery(suggestions[activeIndex]);
											setShowDropdown(false);
											setSearchOpen(false);
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
								<ul className="absolute left-0 top-full mt-2 w-full max-h-56 overflow-auto bg-(--bg) border-[0.5px] border-(--border-color) rounded-md shadow-sm z-30">
									{suggestions.map((s, idx) => (
										<li
											key={s}
											onMouseDown={(e) => {
												e.preventDefault();
												setQuery(s);
												setShowDropdown(false);
												setSearchOpen(false);
											}}
											onMouseEnter={() => setActiveIndex(idx)}
											className={`px-[0.8vmax] py-[0.6vmax] cursor-pointer ${
												idx === activeIndex ? "bg-[rgba(255,255,255,0.04)]" : ""
											}`}
										>
											{s}
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
