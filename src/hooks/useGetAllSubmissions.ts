import { useCallback, useState } from "react";
import {
	type GetAllSubmissionsRequest,
	type GetAllSubmissionsRequestDto,
	type SubmissionCardResponseDto,
	SubmissionControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetAllSubmissions = () => {
	const [submissions, setSubmissions] = useState<
		Array<SubmissionCardResponseDto> | []
	>([]);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchSubmissions = useCallback(
		async (submissionIds: number[], controller: AbortController) => {
			setLoading(true);
			setError(null);
			try {
				const data: GetAllSubmissionsRequestDto = {
					submissionIds: submissionIds,
				};
				const request: GetAllSubmissionsRequest = {
					getAllSubmissionsRequestDto: data,
				};

				const submissionApi = new SubmissionControllerApi(apiConfig);

				const res: Array<SubmissionCardResponseDto> =
					await submissionApi.getAllSubmissions(request, {
						signal: controller.signal,
					});
				if (!res) throw new Error("Some error occured");

				setSubmissions(res);
				setLoading(false);
			} catch (er) {
				if (er instanceof Error) setError(er);
				else setError(new Error("failed to get Submissions"));
			}
		},
		[],
	);

	return {
		submissions,
		error,
		loading,
		fetchSubmissions,
	};
};

export default useGetAllSubmissions;
