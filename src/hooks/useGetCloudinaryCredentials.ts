import { useCallback, useState } from "react";
import {
	CloudinaryControllerApi,
	type CloudinaryResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetCloudinaryCredentials = () => {
	const [cloudinaryCredentials, setCloudinaryCredentials] =
		useState<CloudinaryResponseDto | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchCloudinaryCredentials = useCallback(
		async (controller: AbortController) => {
			setLoading(true);
			setError(null);

			try {
				const cloudinaryControllerApi = new CloudinaryControllerApi(apiConfig);
				const response: CloudinaryResponseDto =
					await cloudinaryControllerApi.getSignature({
						signal: controller.signal,
					});
				if (!response) throw new Error("Cloud service is down.");
				setCloudinaryCredentials(response);
			} catch (er) {
				if (er instanceof Error) setError(er);
				else setError(new Error("failed to get Submission"));
			}
		},
		[],
	);
	return {
		loading,
		error,
		cloudinaryCredentials,
		fetchCloudinaryCredentials,
	};
};

export default useGetCloudinaryCredentials;
