import { useCallback, useState } from "react";
import {
	type GetSubmissionByIdRequest,
	SubmissionControllerApi,
	type SubmissionResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetSubmissions = () => {
	const [submissions, setSubmissions] = useState<SubmissionResponseDto | null>(
		null,
	);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchSubmission = useCallback(
		async (submissionId: number, controller: AbortController) => {
			setLoading(true);
			setError(null);
			try {
				const request: GetSubmissionByIdRequest = { submissionId };
				const submissionApi = new SubmissionControllerApi(apiConfig);

				const res: SubmissionResponseDto =
					await submissionApi.getSubmissionById(request, {
						signal: controller.signal,
					});
				if (!res) throw new Error("Some error occured");

				setSubmissions(res);
			} catch (er: unknown) {
				if (er instanceof Error) setError(er);
				else setError(new Error("failed to get Submission"));
			}
		},
		[],
	);

	return {
		submissions,
		error,
		loading,
		fetchSubmission,
	};
};

export default useGetSubmissions;
