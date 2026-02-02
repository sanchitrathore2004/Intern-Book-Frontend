import { useCallback, useState } from "react";
import { SubmissionControllerApi } from "../../web-client/src/generated";
import type { SubmissionFormData } from "../interfaces/submissionSchema";
import { baseSubmissionMapper } from "../mappers/baseSubmissionMapper";
import { apiConfig } from "../utils/apiConfig";
import { showError } from "../utils/toast";

const useUpdateSubmission = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const editSubmission = useCallback(
		async (
			data: SubmissionFormData,
			submissionId: number,
		): Promise<boolean> => {
			if (!submissionId) {
				showError("Invalid submission id");
				return false;
			}
			setLoading(true);
			try {
				const baseDto = baseSubmissionMapper(data);
				const submissionControllerApi = new SubmissionControllerApi(apiConfig);
				await submissionControllerApi.editSubmission({
					submissionId,
					saveSubmissionRequestDto: baseDto,
				});
				return true;
			} catch (err) {
				if (err instanceof Error) {
					setError(err);
					showError(err.message);
				} else {
					setError(new Error("Failed to update submission"));
					showError("Failed to update submission");
				}
				return false;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { editSubmission, loading, error };
};

export default useUpdateSubmission;
