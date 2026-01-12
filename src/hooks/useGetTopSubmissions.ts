import { useInfiniteQuery } from "@tanstack/react-query";
import { SubmissionControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

type PageParam = {
	cursorLike?: number;
	cursorCreatedAt?: Date;
	limit?: number;
};

const api = new SubmissionControllerApi(apiConfig);

export function useInfiniteTopSubmission() {
	return useInfiniteQuery({
		queryKey: ["top-submission"],
		queryFn: async ({ pageParam }) => {
			const params: PageParam = pageParam ?? { limit: 10 };

			return api.getTopSubmissions({
				cursorLike: params.cursorLike,
				cursorCreatedAt: params.cursorCreatedAt,
				limit: params.limit,
			});
		},
		initialPageParam: { limit: 10 },
		getNextPageParam: (lastPage) => {
			if (!lastPage.hasNext) return undefined;

			return {
				cursorLike: lastPage.nextLikeCount,
				cursorCreatedAt: lastPage.nextCreatedAt,
				limit: 10,
			};
		},
		staleTime: 60_000,
	});
}
