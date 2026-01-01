import type React from "react";
import type { FavouriteItems } from "../interfaces/FavouriteItem";

interface FavouritesCardProps {
  items: FavouriteItems[] | null;
}

const FavouritesCard: React.FC<FavouritesCardProps> = ({ items }) => {
  return (
    <div className="bg-(--fore-bg) rounded-2xl p-4 shadow-md">
      <h4 className="text-(--text-heading) font-semibold mb-3 flex items-center gap-2">
        My Favourites!
      </h4>

      {(!items || items.length === 0) ? (
        <p className="text-sm text-(--text-light)">
          Nothing is favourited yet
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between text-sm text-(--text-heading)"
            >
              <span>{item.company}</span>
              <span className="text-(--text-light)">{item.addedBy}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="text-(--accent) text-xs mt-3 hover:underline"
      >
        See More
      </button>
    </div>
  );
};

export default FavouritesCard;
