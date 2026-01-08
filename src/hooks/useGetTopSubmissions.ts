import { useCallback, useState } from "react";
import {
	type SubmissionCardResponseDto,
	SubmissionControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetTopSubmissions = () => {
	const [submissions, setSubmissions] = useState<SubmissionCardResponseDto[]>(
		[],
	);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchTopSubmissions = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const submissionControllerApi = new SubmissionControllerApi(apiConfig);
			const res = await submissionControllerApi.getTopSubmissions();
			setSubmissions(res ?? []);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error("Failed to fetch favourites"));
		} finally {
			setLoading(false);
		}
	}, []);

	return { submissions, error, loading, fetchTopSubmissions };
};

export default useGetTopSubmissions;
