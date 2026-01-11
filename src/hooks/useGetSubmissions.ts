import { useQuery } from "@tanstack/react-query";
import {
	SubmissionControllerApi,
	type SubmissionResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const api = new SubmissionControllerApi(apiConfig);

const useGetSubmissions = (submissionId?: number) => {
	return useQuery<SubmissionResponseDto, Error>({
		queryKey: ["submission", submissionId],
		queryFn: async () => {
			if (!submissionId) {
				throw new Error("Invalid submission id");
			}

			const res = await api.getSubmissionById({ submissionId });
			if (!res) throw new Error("Some error occurred");

			return res;
		},
		enabled: !!submissionId,
		staleTime: 20 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
};

export default useGetSubmissions;
