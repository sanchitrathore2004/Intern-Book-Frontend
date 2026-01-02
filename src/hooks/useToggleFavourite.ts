import { useCallback, useContext, useState } from "react";
import {
	type AddToFavouritesRequest,
	type ToggleResponseDto,
	UserControllerApi,
} from "../../web-client/src/generated";
import UserContext from "../contexts/UserContext";
import { apiConfig } from "../utils/apiConfig";

interface useToggleFavouriteProps {
	isFavourite: boolean;
	submissionId: number;
}

const useToggleFavourite = (props: useToggleFavouriteProps) => {
	const [isFavourite, setIsFavourite] = useState(props.isFavourite);
	const { dispatch } = useContext(UserContext);

	const handleToggle = useCallback(async () => {
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
		} catch (er) {
			console.error(er);
		}
	}, [dispatch, props.submissionId]);

	return {
		isFavourite,
		handleToggle,
	};
};

export default useToggleFavourite;
