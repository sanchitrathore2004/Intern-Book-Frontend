import { useContext } from "react";
import FavouritesCard from "./FavouritesCard";
import ProfileCard from "./ProfileCard";
import UserContext from "../contexts/UserContext";
import type { FavouriteItems } from "../interfaces/FavouriteItem";

const ProfileSidebar = () => {
	const { user } = useContext(UserContext)
	const items: FavouriteItems[] | null =
		user.favourites
			? user.favourites
				.map((fav) => ({
					id: fav.submissionId,
					company: fav.companyName,
					addedBy: fav.authorName,
				}))
				.filter((item): item is { id: number; company: string; addedBy: string } => item.id !== undefined && item.company !== undefined && item.addedBy !== undefined)
			: null;

	return (
		<aside className="w-full lg:w-72 flex flex-col gap-4">
			<ProfileCard />

			<FavouritesCard
				items={items}

			/>
		</aside>
	);
};

export default ProfileSidebar;
