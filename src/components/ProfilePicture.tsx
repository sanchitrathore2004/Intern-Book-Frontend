const ProfilePicture = () => {
	const imgSrc =
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQn2-hFzsufsjhrUXE985YyMdX8YSYQ44kmQ&s";

	return (
		<div className="w-full h-full rounded-xl overflow-hidden bg-gray-700">
			<img src={imgSrc} alt={imgSrc} className="w-full h-full object-cover" />
		</div>
	);
};

export default ProfilePicture;
