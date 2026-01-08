import { useCallback, useState } from "react";
import {
	type SubmissionCardResponseDto,
	UserControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetFavourites = () => {
	const [submissions, setSubmissions] = useState<
		SubmissionCardResponseDto[] | null
	>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchFavourites = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const userControllerApi = new UserControllerApi(apiConfig);
			const res = await userControllerApi.getFavouritesByUserId();
			setSubmissions(res ?? []);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error("Failed to fetch favourites"));
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		submissions,
		error,
		loading,
		fetchFavourites,
	};
};

export default useGetFavourites;
