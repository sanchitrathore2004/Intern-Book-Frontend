import { useCallback, useState } from "react";
import { SubmissionControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useDeleteSubmission = () => {
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const deleteSubmission = useCallback(
		async (
			submissionId: number,
			controller: AbortController,
		): Promise<boolean> => {
			setLoading(true);
			setError(null);
			try {
				const submissionControllerApi = new SubmissionControllerApi(apiConfig);

				await submissionControllerApi.deleteSubmissionRaw(
					// call raw here beacuse json parsing occurs in non raw
					{ submissionId },
					controller ? { signal: controller.signal } : undefined,
				);

				return true;
			} catch (err) {
				if (err instanceof Error) setError(err);
				else setError(new Error("Failed to delete submission"));
				return false;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		error,
		loading,
		deleteSubmission,
	};
};

export default useDeleteSubmission;
