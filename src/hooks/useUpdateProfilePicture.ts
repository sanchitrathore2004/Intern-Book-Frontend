import { useCallback, useState } from "react";
import {
	type UpdateDpRequest,
	UserControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useUpdateProfilePicture = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const updateUserProfilePicture = useCallback(
		async (
			secureUrl: string,
			controller: AbortController,
		): Promise<boolean> => {
			setLoading(true);
			setError(null);
			try {
				const userControllerApi = new UserControllerApi(apiConfig);
				const request: UpdateDpRequest = {
					updateProfilePictureRequestDto: {
						profileUrl: secureUrl,
					},
				};
				await userControllerApi.updateDp(request, {
					signal: controller.signal,
				});
				return true;
			} catch (er) {
				if (er instanceof Error) setError(er);
				else setError(new Error("Upload failed."));
				return false;
			}
		},
		[],
	);
	return {
		loading,
		error,
		updateUserProfilePicture,
	};
};

export default useUpdateProfilePicture;
