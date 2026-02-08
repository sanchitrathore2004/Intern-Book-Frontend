import { useCallback, useState } from "react";
import { AdminControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useDeleteSubmissionAdmin = () => {
	const [submissionError, setSubmissionError] = useState<Error | string | null>(
		null,
	);
	const deleteSubmissionAdmin = useCallback(
		async (submissionId: string, controller: AbortController) => {
			try {
				const adminControllerApi = new AdminControllerApi(apiConfig);
				await adminControllerApi.deleteSubmission1({
					submissionId: parseInt(submissionId),
				});
			} catch (error) {
				if (error instanceof Error) setSubmissionError(error);
				else setSubmissionError("Cannot delete submission");
			}
		},
		[],
	);
	return { deleteSubmissionAdmin, submissionError };
};
export default useDeleteSubmissionAdmin;
