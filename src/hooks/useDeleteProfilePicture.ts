import { useCallback, useState } from "react";
import {
	type DeleteProfileResponseDto,
	UserControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useDeleteProfilePicture = () => {
	const [error, setError] = useState<Error | null>(null);
	const deleteProfilePicture = useCallback(
		async (controller: AbortController): Promise<string | null> => {
			try {
				const userControllerApi = new UserControllerApi(apiConfig);
				const response: DeleteProfileResponseDto =
					await userControllerApi.deleteProfile();
				return response.profileUrl ?? null;
			} catch (er) {
				if (er instanceof Error) setError(er);
				else setError(new Error("Upload failed."));
				throw error;
			}
		},
		[error],
	);
	return { deleteProfilePicture };
};

export default useDeleteProfilePicture;
