import type { ProfilePictureProps } from "../interfaces/ProfilePictureProps";

const ProfilePicture = (props: ProfilePictureProps) => {
	return (
		<div className="w-full h-full rounded-xl overflow-hidden bg-(--fore-bg)">
			<img
				src={props.profileUrl}
				alt={props.profileUrl}
				className="w-full h-full object-cover"
			/>
		</div>
	);
};

export default ProfilePicture;
