import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useToggleFavourite from "../hooks/useToggleFavourite";
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
}

export const ProfileBox = (props: ProfileBoxProps) => {
	const navigate = useNavigate();
	const { isFavourite, handleToggle } = useToggleFavourite(props);

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
						className="text-(--text-heading) hover:text-(--accent) text-3xl font-[GoldmanSansBd] font-bold mb-4 cursor-pointer"
					>
						{props.name}
					</button>
					<div>{props.department}</div>
					<div>{props.email}</div>
					<div>{props.degree}</div>
					<div>{props.year} year</div>
					<div className="flex gap-2">
						<div>CGPA</div>
						<div className="text-(--text-heading)">{props.cgpa}</div>
					</div>
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
			{/* Mobile only */}
			<div className="flex md:hidden flex-col bg-(--fore-bg) p-4 rounded-[0.75em]  w-full">
				<div className="flex justify-between">
					<div className="border border-(--border-color) rounded-[0.75em] max-w-40 min-w-32 overflow-hidden">
						<img src={props.profileUrl} alt="profile" />
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
				</div>
			</div>
		</>
	);
};
