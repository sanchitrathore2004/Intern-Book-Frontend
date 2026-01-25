import { useCallback, useState } from "react";
import { UserControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetToggleUser = () => {
	const [isAnonymous, setAnonymous] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setLoading] = useState(false);

	const getToggleResponse = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const api = new UserControllerApi(apiConfig);
			const res = await api.getAnonymousProfile();
			setAnonymous(res.isAnonymous ?? false);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error("Failed to fetch toggle response"));
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		isAnonymous,
		error,
		isLoading,
		getToggleResponse,
	};
};

export default useGetToggleUser;
