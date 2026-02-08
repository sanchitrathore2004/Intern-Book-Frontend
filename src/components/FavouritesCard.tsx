import type React from "react";
import { useNavigate } from "react-router-dom";
import type { FavouriteItems } from "../interfaces/FavouriteItem";
import { navigateWithModifiers } from "../utils/navigateWithModifiers";

interface FavouritesCardProps {
	items: FavouriteItems[] | null;
	onSeeMore: () => void;
}

const FavouritesCard: React.FC<FavouritesCardProps> = ({
	items,
	onSeeMore,
}) => {
	const navigate = useNavigate();

	const handleShowDetials = (e: React.MouseEvent, id: number) => {
		navigateWithModifiers(e, navigate, `/submission/${id}`);
	};

	return (
		<div className="hidden md:block bg-(--fore-bg) rounded-2xl p-4 shadow-md">
			<h4 className="text-(--text-heading) font-semibold mb-3 flex items-center gap-2">
				My Favourites!
			</h4>

			{!items || items.length === 0 ? (
				<p className="text-sm text-(--text-light)">Nothing is favourited yet</p>
			) : (
				<ul className="divide-y divide-(--border-color)">
					{items.map((item) => (
						<li key={item.id}>
							<button
								type="button"
								className="
          w-full flex justify-between items-center
          py-2 text-sm text-(--text-heading)
          hover:bg-(--hover-bg)
          transition rounded-md px-2 cursor-pointer"
								onClick={(e) => handleShowDetials(e, item.id)}
							>
								<div className="hover:underline">
									<span>{item.company}</span>
								</div>
								<span className="text-(--text-light)">{item.addedBy}</span>
							</button>
						</li>
					))}
				</ul>
			)}

			<button
				type="button"
				onClick={onSeeMore}
				className="text-(--accent) text-xs mt-3 hover:underline cursor-pointer"
			>
				See More
			</button>
		</div>
	);
};

export default FavouritesCard;
