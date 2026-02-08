import { useCallback, useState } from "react";
import { AdminControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useDeleteSubmissionAdmin = () => {
	const [submissionError, setSubmissionError] = useState<Error | string | null>(
		null,
	);

	const deleteSubmissionAdmin = useCallback(
		async (
			submissionId: string,
			controller?: AbortController,
		): Promise<boolean> => {
			setSubmissionError(null);
			try {
				const adminControllerApi = new AdminControllerApi(apiConfig);
				await adminControllerApi.deleteSubmission1(
					{
						submissionId: parseInt(submissionId),
					},
					{ signal: controller?.signal },
				);
				return true;
			} catch (error) {
				if (error instanceof Error) {
					if ((error as any).name === "AbortError") {
						return false;
					}
					setSubmissionError(error);
				} else {
					setSubmissionError("Cannot delete submission");
				}
				return false;
			}
		},
		[],
	);
	return { deleteSubmissionAdmin, submissionError };
};
export default useDeleteSubmissionAdmin;
