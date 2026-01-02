import { useEffect, useState } from "react";
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

	useEffect(() => {
		const submissionControllerApi = new SubmissionControllerApi(apiConfig);

		submissionControllerApi
			.getTopSubmissions()
			.then((res) => {
				setSubmissions(res ?? []);
			})
			.catch((err) => {
				setError(err as Error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return { submissions, error, loading };
};

export default useGetTopSubmissions;
