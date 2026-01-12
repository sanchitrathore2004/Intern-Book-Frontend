import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
	type GetAllSubmissionsRequest,
	type GetAllSubmissionsRequestDto,
	type SubmissionCardResponseDto,
	SubmissionControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

export const submissionsByIdsKey = (submissionIds: number[]) => {
	const ids = Array.from(new Set(submissionIds))
		.filter((n) => Number.isFinite(n) && n > 0)
		.sort((a, b) => a - b);
	return ["submissions", "byIds", ids] as const;
};

export const fetchSubmissionsByIds = async ({
	submissionIds,
	signal,
}: {
	submissionIds: number[];
	signal?: AbortSignal;
}): Promise<SubmissionCardResponseDto[]> => {
	const data: GetAllSubmissionsRequestDto = {
		submissionIds,
	};
	const request: GetAllSubmissionsRequest = {
		getAllSubmissionsRequestDto: data,
	};

	const submissionApi = new SubmissionControllerApi(apiConfig);
	const res = await submissionApi.getAllSubmissions(request, { signal });
	return res ?? [];
};

export const useSubmissionsByIds = (
	submissionIds: number[],
	{
		enabled = true,
		staleTimeMs = 60_000,
	}: { enabled?: boolean; staleTimeMs?: number } = {},
) => {
	const normalizedIds = useMemo(() => {
		return Array.from(new Set(submissionIds))
			.filter((n) => Number.isFinite(n) && n > 0)
			.sort((a, b) => a - b);
	}, [submissionIds]);

	return useQuery<SubmissionCardResponseDto[], Error>({
		queryKey: submissionsByIdsKey(normalizedIds),
		enabled: enabled && normalizedIds.length > 0,
		staleTime: staleTimeMs,
		queryFn: ({ signal }) =>
			fetchSubmissionsByIds({ submissionIds: normalizedIds, signal }),
	});
};
