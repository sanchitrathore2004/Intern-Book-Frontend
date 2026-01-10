import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { navigateWithModifiers } from "../utils/navigateWithModifiers";
import ProfilePicture from "./ProfilePicture";

const ProfileCard = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	return (
		<div className="w-full bg-(--fore-bg) rounded-2xl px-6 py-5 shadow-md">
			<div className="flex items-center justify-between">
				<div className="w-20 h-20">
					<ProfilePicture profileUrl={user.profileUrl ?? "profile"} />
				</div>

				<button
					type="button"
					onClick={(e) => navigateWithModifiers(e, navigate, "/submissionForm")}
					className="w-8 h-8 bg-(--accent) text-(--fore-bg) rounded-full flex items-center justify-center text-lg hover:scale-105 cursor-pointer transition-all active:scale-95"
				>
					+
				</button>
			</div>

			<div className="mt-5 bg-(--bg) rounded-xl p-4">
				<h3 className="text-(--text-heading) font-semibold text-base mb-4">
					{user.name}
				</h3>

				<div className="text-sm space-y-2">
					<div className="flex justify-between">
						<span className="text-(--text-light)">Favourites</span>
						<span className="text-(--accent) font-medium">
							{user.favouritesCount}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-(--text-light)">Submissions</span>
						<span className="text-(--accent) font-medium">
							{user.submissionsCount}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileCard;
