import { Bookmark } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useToggleFavourite from "../hooks/useToggleFavourite";
import { DepartmentConfig } from "../utils/departmentConfig";
import { YearConfig } from "../utils/yearConfig";
import ProfilePicture from "./ProfilePicture";

interface ProfileBoxProps {
	submissionId: number;
	authorId: number;
	cgpa: string;
	profileUrl: string;
	name: string;
	department: string;
	email: string;
	degree: string;
	year: string;
	isFavourite: boolean;
	likeCount: number;
}

export const ProfileBox = (props: ProfileBoxProps) => {
	const navigate = useNavigate();
	const { isFavourite, likeCount, handleToggle } = useToggleFavourite(props);

	const getDepartment = useCallback(
		(dept: string | undefined): string | undefined => {
			if (dept === undefined) return "NA";
			const departmentConfig = new DepartmentConfig();
			return departmentConfig.getDepartment(dept);
		},
		[],
	);

	const getYear = useCallback((yr: string | undefined): string | undefined => {
		if (yr === undefined) return "NA";
		const yearConfig = new YearConfig();
		return yearConfig.getYear(yr);
	}, []);

	return (
		<>
			{/* Desktop only */}
			<div className="hidden md:flex bg-(--fore-bg) p-4 rounded-[1.5em]  items-center gap-8">
				<div>
					<div className="border border-(--border-color) rounded-[1.5em] max-w-64 min-w-32 overflow-hidden">
						<ProfilePicture profileUrl={props.profileUrl} />
					</div>
				</div>
				<div className="text-(--text-light) flex flex-col gap-0 justify-center">
					<div className="font-bold text-lg">Author</div>
					<button
						type="button"
						onClick={() => navigate(`/profile/${props.authorId}`)}
						className="text-(--text-heading) hover:text-(--accent) text-left text-3xl font-[GoldmanSansBd] font-bold mb-4 cursor-pointer transition-all active:scale-95"
					>
						{props.name}
					</button>
					<div>{getDepartment(props.department)}</div>
					<div>{props.email}</div>
					<div>{props.degree}</div>
					<div>{getYear(props.year)}</div>
					<div className="flex gap-2">
						<div>CGPA</div>
						<div className="text-(--text-heading)">{props.cgpa}</div>
					</div>
				</div>
				<div className="flex items-center gap-2 self-start ml-auto">
					<div className="text-(--text-light) text-sm flex items-center gap-1">
						<span>❤️</span>
						<span className="font-medium">{likeCount}</span>
					</div>

					<button
						type="button"
						onClick={handleToggle}
						className="hover:cursor-pointer"
					>
						{isFavourite ? (
							<Bookmark
								className="text-(--accent) w-4 lg:w-8"
								fill="var(--accent)"
							/>
						) : (
							<Bookmark className="text-(--accent) w-4 lg:w-8" />
						)}
					</button>
				</div>
			</div>
			{/* Mobile only */}
			<div className="flex md:hidden flex-col bg-(--fore-bg) p-4 rounded-[0.75em]  w-full">
				<div className="flex justify-between">
					<div className="border border-(--border-color) rounded-[0.75em] max-w-40 min-w-32 overflow-hidden">
						<img fetchPriority="high" src={props.profileUrl} alt="profile" />
					</div>
					<button
						type="button"
						onClick={handleToggle}
						className="hover:cursor-pointer self-start ml-auto"
					>
						{isFavourite ? (
							<Bookmark
								className="text-(--accent) w-4 lg:w-8"
								fill="var(--accent)"
							/>
						) : (
							<Bookmark className="text-(--accent) w-4 lg:w-8" />
						)}
					</button>
				</div>
				<div className="text-(--text-light) ml-4 mt-2 flex flex-col gap-0 justify-center">
					<div className="font-bold text-lg">Author</div>
					<div className="text-(--text-heading) text-3xl font-[GoldmanSansBd] font-bold mb-4">
						{props.name}
					</div>
					<div>{props.department}</div>
					<div>{props.email}</div>
					<div>{props.degree}</div>
					<div>{props.year}</div>
					<div className="flex gap-2">
						<div>CGPA</div>
						<div className="text-(--text-heading)">{props.cgpa}</div>
					</div>
					<div className="flex items-center gap-2 mt-1 text-(--text-light)">
						<span>❤️</span>
						<span className="font-medium">{likeCount}</span>
					</div>
				</div>
			</div>
		</>
	);
};
