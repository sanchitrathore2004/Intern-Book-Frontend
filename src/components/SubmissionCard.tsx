import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import useToggleFavourite from "../hooks/useToggleFavourite";
import { homeNavState } from "../utils/homeNavState";
import { navigateWithModifiers } from "../utils/navigateWithModifiers";
import { YearConfig } from "../utils/yearConfig";
import Tags from "./Tags";

interface SubmissionCardProps {
	id: number;
	companyId: number;
	companyName: string;
	userName: string;
	type?: string;
	domainName?: string;
	year: number;
	tags: string[];
	companyLogoUrl?: string;
	isFavourite?: boolean;
	likeCount?: number;
	isAnonymous?: boolean;
	onNavigate?: () => { scrollTop: number; pageCount: number };
}

const getYear = (yr: string | undefined): string | undefined => {
	if (yr === undefined) return "NA";
	const yearConfig = new YearConfig();
	return yearConfig.getYear(yr);
};

function SubmissionCard(props: SubmissionCardProps) {
	const navigate = useNavigate();
	const { theme } = useTheme();
	const [error, setError] = useState(false);

	const { isFavourite, likeCount, handleToggle } = useToggleFavourite({
		submissionId: props.id,
		isFavourite: props.isFavourite ?? false,
		likeCount: props.likeCount ?? 0,
	});

	return (
		<div className="w-full h-full flex flex-col justify-between items-center p-1 rounded-[0.6vmax] bg-(--bg) transition-all duration-200 hover:shadow-[0_0_8px_var(--shadow-color)]">
			<div className="relative w-full max-h-[40%] flex justify-center items-center pt-3">
				{error ? (
					<img
						fetchPriority="high"
						key={theme}
						className="h-full w-full rounded-tl-[0.6vmax] rounded-tr-[0.6vmax] p-[0.1vmax] object-contain"
						src={
							theme === "light"
								? "/assets/images/app_icon_dark.png"
								: "/assets/images/app_icon_light.png"
						}
						alt={`${props.companyName} logo`}
					/>
				) : (
					<img
						fetchPriority="high"
						key={theme}
						className={`h-full w-full rounded-tl-[0.6vmax] rounded-tr-[0.6vmax] p-[0.1vmax] object-contain`}
						src={props.companyLogoUrl}
						alt={`${props.companyName} logo`}
						onError={() => {
							setError(true);
						}}
					/>
				)}

				<div className="absolute top-2 right-2 flex items-center gap-1  backdrop-blur-sm px-2 py-0.5 rounded-full text--(text-light) sm:text-[1.2vmax] text-[1.9vmax] font-medium">
					❤️ {likeCount}
				</div>
			</div>

			<div className=" w-full max-h-[30%] flex flex-col justify-center items-center">
				<div
					style={{ fontFamily: "GoldmanSansBd" }}
					className="w-full h-fit flex items-center sm:text-[2vmax] text-[2.2vmax] font-bold text-(--text-heading) pl-[0.5vmax]"
				>
					<button
						type="button"
						onClick={(e) =>
							navigateWithModifiers(e, navigate, `/company/${props.companyId}`)
						}
						className="cursor-pointer"
					>
						{props.companyName}
					</button>
				</div>
				<div className="w-full max-h-[40%] flex items-start text-(--text-light) font-light sm:text-[1.2vmax] text-[1.6vmax] pl-[0.5vmax] mb-2">
					{props.isAnonymous ? "Anonymous" : props.userName.split(" ")[0]}
					{" . "}
					{props.type}
					{" . "}
					{props.domainName}
					{!props.isAnonymous && (
						<>
							{" . "}
							{getYear(String(props.year))}
						</>
					)}
				</div>
			</div>

			<div className="w-full h-fit flex flex-wrap gap-[0.5vmax] pl-[0.5vmax]">
				{props.tags.map((tag) => {
					return (
						<div key={tag} className="h-fit">
							<Tags tagName={tag} />
						</div>
					);
				})}
			</div>

			<div className="w-full h-[12%] justify-center flex items-end pl-[0.5vmax] pb-2">
				<button
					type="button"
					onClick={(e) => {
						const navState = props.onNavigate?.();
						if (navState) {
							homeNavState.set(navState);
						}
						navigateWithModifiers(e, navigate, `/submission/${props.id}`);
					}}
					className="h-[80%] w-[80%] flex justify-center items-center bg-(--accent) rounded-md font-bold cursor-pointer sm:text-[1.4vmax] text-[1.9vmax] text-(--bg) transition-all active:scale-95"
				>
					Show Details
				</button>
				<button
					type="button"
					onClick={handleToggle}
					className="h-[90%] w-[20%] flex justify-center items-center cursor-pointer"
				>
					{isFavourite ? (
						<Bookmark
							className="text-(--accent) sm:w-4 w-8 lg:w-8"
							fill="var(--accent)"
						/>
					) : (
						<Bookmark className="text-(--accent) sm:w-4 w-8 lg:w-8" />
					)}
				</button>
			</div>
		</div>
	);
}
export default SubmissionCard;
