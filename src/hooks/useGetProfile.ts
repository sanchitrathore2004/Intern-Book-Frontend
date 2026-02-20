import { useCallback, useState } from "react";
import {
	type GetProfileByIdRequest,
	UserControllerApi,
	type UserProfileResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetProfile = () => {
	const [profile, setProfile] = useState<UserProfileResponseDto | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchProfileDetails = useCallback(
		async (userId: number, controller: AbortController) => {
			setLoading(true);
			setError(null);
			setProfile(null);

			try {
				const userControllerApi = new UserControllerApi(apiConfig);
				const request: GetProfileByIdRequest = { userId };

				const res: UserProfileResponseDto =
					await userControllerApi.getProfileById(request, {
						signal: controller.signal,
					});

				if (!res) {
					throw new Error("User not found");
				}

				setProfile(res);
			} catch (er: unknown) {
				if (er instanceof Error) {
					setError(er);
				} else {
					setError(new Error("Failed to get profile"));
				}
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		profile,
		error,
		loading,
		fetchProfileDetails,
	};
};

export default useGetProfile;
