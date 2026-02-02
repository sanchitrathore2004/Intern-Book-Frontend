import { useCallback, useContext, useState } from "react";
import { UserControllerApi } from "../../web-client/src/generated";
import UserContext from "../contexts/UserContext";
import { apiConfig } from "../utils/apiConfig";

const useGetToggleUser = () => {
	const { dispatch } = useContext(UserContext);

	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setLoading] = useState(false);

	const getToggleResponse = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const api = new UserControllerApi(apiConfig);
			const res = await api.getAnonymousProfile();

			dispatch({
				type: "UPDATE_PROFILE",
				payload: {
					anonymous: res.isAnonymous ?? false,
				},
			});
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error("Failed to fetch toggle response"));
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	return {
		error,
		isLoading,
		getToggleResponse,
	};
};

export default useGetToggleUser;
