import FavouritesCard from "./FavouritesCard";
import ProfileCard from "./ProfileCard";

const ProfileSidebar = () => {
	return (
		<aside className="w-full lg:w-72 flex flex-col gap-4">
			<ProfileCard />

			<FavouritesCard
				items={[
					{ id: 1, company: "Oracle", addedBy: "Abhishek" },
					{ id: 2, company: "SAP", addedBy: "Rathore Saab" },
					{ id: 3, company: "Goldman", addedBy: "Pranshu" },
				]}
			/>
		</aside>
	);
};

export default ProfileSidebar;
