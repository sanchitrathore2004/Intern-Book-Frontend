import { useCallback, useState } from "react";
import {
	type AddCompanyRequestDto,
	UserControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";
import { showError } from "../utils/toast";

const useSendCompanyRequest = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const sendCompanyRequest = useCallback(
		async (data: AddCompanyRequestDto): Promise<boolean> => {
			setLoading(true);
			try {
				const userControllerApi = new UserControllerApi(apiConfig);
				await userControllerApi.addCompanyRequest({
					addCompanyRequestDto: data,
				});
				return true;
			} catch (err) {
				if (err instanceof Error) {
					setError(err);
					showError(err.message);
				} else setError(new Error("Failed to submit response"));
				return false;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { sendCompanyRequest, error, loading };
};

export default useSendCompanyRequest;
