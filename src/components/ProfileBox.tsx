import { Bookmark } from "lucide-react";
import userResponse from "../mocks/userResponse.json";

interface ProfileBoxProps {
	cgpa: string;
}

export const ProfileBox = (props: ProfileBoxProps) => {
	return (
		<>
			{/* Desktop only */}
			<div className="hidden md:flex bg-(--fore-bg) p-4 rounded-[1.5em]  items-center gap-8">
				<div>
					<div className="border border-(--border-color) rounded-[1.5em] max-w-64 min-w-32 overflow-hidden">
						<img src={userResponse.profileUrl} alt="profile" />
					</div>
				</div>
				<div className="text-(--text-light) flex flex-col gap-0 justify-center">
					<div className="font-bold text-lg">Author</div>
					<div className="text-(--text-heading) text-3xl font-[GoldmanSansBd] font-bold mb-4">
						{userResponse.name}
					</div>
					<div>{userResponse.department}</div>
					<div>{userResponse.email}</div>
					<div>{userResponse.degree}</div>
					<div>{userResponse.year}</div>
					<div className="flex gap-2">
						<div>CGPA</div>
						<div className="text-(--text-heading)">{props.cgpa}</div>
					</div>
				</div>
				<button
					type="button"
					className="hover:cursor-pointer self-start ml-auto"
				>
					<Bookmark className="text-(--accent)" />
				</button>
			</div>
			{/* Mobile only */}
			<div className="flex md:hidden flex-col bg-(--fore-bg) p-4 rounded-[0.75em]  w-full">
				<div className="flex justify-between">
					<div className="border border-(--border-color) rounded-[0.75em] max-w-40 min-w-32 overflow-hidden">
						<img src={userResponse.profileUrl} alt="profile" />
					</div>
					<button
						type="button"
						className="hover:cursor-pointer self-start ml-auto"
					>
						<Bookmark className="text-(--accent)" />
					</button>
				</div>
				<div className="text-(--text-light) ml-4 mt-2 flex flex-col gap-0 justify-center">
					<div className="font-bold text-lg">Author</div>
					<div className="text-(--text-heading) text-3xl font-[GoldmanSansBd] font-bold mb-4">
						{userResponse.name}
					</div>
					<div>{userResponse.department}</div>
					<div>{userResponse.email}</div>
					<div>{userResponse.degree}</div>
					<div>{userResponse.year}</div>
					<div className="flex gap-2">
						<div>CGPA</div>
						<div className="text-(--text-heading)">{props.cgpa}</div>
					</div>
				</div>
			</div>
		</>
	);
};
