import { Bookmark, Moon, Search, Sun } from "lucide-react";
import darkAppIcon from "../assets/images/app_icon_dark.png";
import lightAppIcon from "../assets/images/app_icon_light.png";
import { useTheme } from "../contexts/ThemeContext.tsx";

interface NavigationBarProps {
	profilePictureUrl: string;
}

function Navigation(props: NavigationBarProps) {
	const { theme, toggleTheme } = useTheme();
	return (
		<div className="w-full h-full flex justify-between items-center border-b border-(--border-color)">
			<div className="w-[50%] h-full flex items-center gap-[1.7vmax]">
				<div className="h-full w-fit flex items-center pl-[1.5vmax]">
					<img
						className="h-[3.7vmax]"
						src={theme === "light" ? darkAppIcon : lightAppIcon}
						alt=""
					/>
				</div>
				<div
					style={{
						fontFamily: "GoldmanSansLt",
						fontSize: "2vmax",
					}}
					className="h-full hidden sm:flex items-center pt-[0.8vmax] text-(--text-heading)"
				>
					Intern Book
				</div>
			</div>
			<div className="w-[50%] h-full flex items-center justify-end gap-[1.5vmax] pr-[1.5vmax]">
				<input
					type="text"
					placeholder="Search"
					className="h-[2.9vmax] w-[18vmax] bg-(--bg) border border-(--border-color) rounded-[0.6vmax] text-(--text-light) pl-[1vmax] pr-[1vmax] hidden sm:flex items-center text-[1.2vmax]
                    justify-center
                    cursor-pointer
                    transition-all duration-200
                    hover:shadow-[0_0_10px_rgba(var(--shadow-color))]"
				/>
				<div
					className="h-[2.9vmax] w-[3vmax]
            bg-(--bg)
            border border-(--border-color)
            rounded-[0.6vmax]
            sm:hidden flex justify-center items-center
            cursor-pointer
            transition-all duration-200
            hover:shadow-[0_0_10px_rgba(var(--shadow-color))]"
				>
					<Search className="text-[#4F4F4F] w-3 sm:w-6" />
				</div>
				<div
					className="h-[2.9vmax] w-[3vmax]
            bg-(--bg)
            border border-(--border-color)
            rounded-[0.6vmax]
            flex justify-center items-center
            cursor-pointer
            transition-all duration-200
            hover:shadow-[0_0_10px_rgba(var(--shadow-color))]"
				>
					<Bookmark className="text-(--accent) fill-(--accent) w-3 sm:w-6" />
				</div>
				<div className="h-[2.9vmax] w-[3vmax] bg-(--bg) rounded-[0.6vmax]">
					<img
						className="h-full w-full object-cover object-center 
                    bg-(--bg)
                    border border-(--border-color)
                    rounded-[0.6vmax]
                    flex justify-center items-center
                    cursor-pointer
                    transition-all duration-200
                    hover:shadow-[0_0_10px_rgba(var(--shadow-color))]"
						src={props.profilePictureUrl}
						alt=""
					/>
				</div>
				<div
					onClick={toggleTheme}
					className="h-[2.9vmax] w-[3vmax]
                    bg-(--bg)
                    border border-(--border-color)
                    rounded-[0.6vmax]
                    flex justify-center items-center
                    cursor-pointer
                    transition-all duration-200
                    hover:shadow-[0_0_10px_rgba(var(--shadow-color))]"
				>
					{theme === "dark" ? (
						<Sun className="w-3 sm:w-6 text-[#BAB9B9]" />
					) : (
						<Moon className="w-3 sm:w-6 text-[#BAB9B9]" />
					)}
				</div>
			</div>
		</div>
	);
}

export default Navigation;
