import { Bookmark, Moon, Sun } from "lucide-react";
import lightAppIcon from "../assets/images/app_icon_dark.png";
import darkAppIcon from "../assets/images/app_icon_light.png";
import { useTheme } from "../contexts/ThemeContext.tsx";

interface NavigationBarProps {
	profilePictureUrl: string;
}

function Navigation(props: NavigationBarProps) {
	const { theme, toggleTheme } = useTheme();
	return (
		<div className="w-full h-full flex justify-between items-center border-b border-(--line-color)">
			<div className="w-[50%] h-full flex items-center gap-[1.7vmax]">
				<div className="h-full w-fit flex items-center pl-[1.5vmax]">
					<img
						className="h-[3.7vmax]"
						src={theme === "light" ? lightAppIcon : darkAppIcon}
						alt=""
					/>
				</div>
				<div
					style={{
						fontFamily: "GoldmanSansLt",
						fontSize: "2vmax",
					}}
					className="h-full flex items-center pt-[0.8vmax] text-(--text-heading)"
				>
					Intern Book
				</div>
			</div>
			<div className="w-[50%] h-full flex items-center justify-end gap-[1.5vmax] pr-[1.5vmax]">
				<input
					type="text"
					placeholder="Search"
					className="h-[2.9vmax] w-[18vmax] bg-(--bg) border border-(--border-color) rounded-[0.6vmax] text-(--text-light) pl-[1vmax] pr-[1vmax] flex items-center
                    justify-center
                    cursor-pointer
                    transition-all duration-200
                    hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]"
				/>
				<div
					className="h-[2.9vmax] w-[3vmax]
            bg-(--bg)
            border border-(--border-color)
            rounded-[0.6vmax]
            flex justify-center items-center
            cursor-pointer
            transition-all duration-200
            hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]"
				>
					<Bookmark className="text-(--accent)" fill="var(--accent)" />
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
                    hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]"
						src={props.profilePictureUrl}
						alt=""
					/>
				</div>
				<button
					type="button"
					onClick={toggleTheme}
					className="h-[2.9vmax] w-[3vmax]
                    bg-(--bg)
                    border border-(--border-color)
                    rounded-[0.6vmax]
                    flex justify-center items-center
                    cursor-pointer
                    transition-all duration-200
                    hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]"
				>
					{theme === "dark" ? (
						<Sun color="var(--accent)" />
					) : (
						<Moon color="var(--accent)" />
					)}
				</button>
			</div>
		</div>
	);
}

export default Navigation;
