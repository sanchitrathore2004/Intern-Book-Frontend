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

			try {
				const userControllerApi = new UserControllerApi(apiConfig);
				const request: GetProfileByIdRequest = { userId };

				const res: UserProfileResponseDto =
					await userControllerApi.getProfileById(request, {
						signal: controller.signal,
					});

				if (!res) throw new Error("Some error occured");

				setProfile(res);
				setLoading(false);
			} catch (er) {
				if (er instanceof Error) setError(er);
				else setError(new Error("failed to get Submission"));
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
