import { useContext } from "react";
import UserContext from "../contexts/UserContext";

const ProfilePicture = () => {
	const { user } = useContext(UserContext);
	return (
		<div className="w-full h-full rounded-xl overflow-hidden bg-(--fore-bg)">
			<img
				src={user.profileUrl}
				alt={user.profileUrl}
				className="w-full h-full object-cover"
			/>
		</div>
	);
};

export default ProfilePicture;
