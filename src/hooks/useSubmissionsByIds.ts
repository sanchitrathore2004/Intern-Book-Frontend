import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { SubmissionCardResponseDto } from "../../web-client/src/generated";
import {
	fetchSubmissionsByIds,
	submissionsByIdsKey,
} from "../queries/submissions";

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
