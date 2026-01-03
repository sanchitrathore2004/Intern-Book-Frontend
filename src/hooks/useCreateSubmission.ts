import { useCallback, useState } from "react";
import { SubmissionControllerApi } from "../../web-client/src/generated";
import type { SubmissionFormData } from "../interfaces/submissionSchema";
import submissionMapper from "../mappers/submissionMapper";
import { apiConfig } from "../utils/apiConfig";
import { showError } from "../utils/toast";

const useCreateSubmission = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const createSubmission = useCallback(
		async (data: SubmissionFormData): Promise<boolean> => {
			setLoading(true);
			try {
				const requestDto = submissionMapper(data);
				const submissionControllerApi = new SubmissionControllerApi(apiConfig);
				await submissionControllerApi.saveSubmission({
					saveSubmissionRequestDto: requestDto,
				});
				return true;
			} catch (err) {
				if (err instanceof Error) {
					setError(err);
					showError(err.message);
				} else setError(new Error("Failed to submit response"));
				return false;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { createSubmission, error, loading };
};

export default useCreateSubmission;
