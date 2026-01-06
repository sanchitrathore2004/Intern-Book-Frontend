import { useCallback, useContext, useState } from "react";
import {
	type AddToFavouritesRequest,
	type ToggleResponseDto,
	UserControllerApi,
} from "../../web-client/src/generated";
import UserContext from "../contexts/UserContext";
import { apiConfig } from "../utils/apiConfig";
import { showSuccess } from "../utils/toast";

interface useToggleFavouriteProps {
	isFavourite: boolean;
	submissionId: number;
	likeCount: number;
}

const useToggleFavourite = (props: useToggleFavouriteProps) => {
	const [isFavourite, setIsFavourite] = useState(props.isFavourite);
	const [likeCount, setLikeCount] = useState(props.likeCount);
	const { dispatch } = useContext(UserContext);

	const handleToggle = useCallback(async () => {
		setIsFavourite((prev) => {
			setLikeCount((count) => (prev ? count - 1 : count + 1));
			return !prev;
		});
		try {
			const request: AddToFavouritesRequest = {
				submissionId: props.submissionId,
			};
			const userApi = new UserControllerApi(apiConfig);

			const res: ToggleResponseDto = await userApi.toggleFavourites(request);
			if (res === null || res.favourite === undefined)
				throw new Error("Some error occured while toggling submission");

			dispatch({ type: "UPDATE_PROFILE", payload: res });
			setIsFavourite(res.favourite);
			if (res.favourite) showSuccess("Added to favourites", 1000);
			else showSuccess("Removed from favourites", 1000);
		} catch (er) {
			console.error(er);
			setIsFavourite(props.isFavourite);
			setLikeCount(props.likeCount);
		}
	}, [dispatch, props.submissionId, props.isFavourite, props.likeCount]);

	return {
		isFavourite,
		likeCount,
		handleToggle,
	};
};

export default useToggleFavourite;
