import { useQuery } from "@tanstack/react-query";
import {
	type AutocompleteRequestDto,
	type GetAutoCompleteRequest,
	SubmissionControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useAutoComplete = (query: string, enabled: boolean = true) => {
	const normalizedQuery = query.trim().toLocaleLowerCase();

	const queryResult = useQuery({
		queryKey: ["autocomplete", normalizedQuery],
		queryFn: async ({ signal }) => {
			const data: AutocompleteRequestDto = { query: normalizedQuery };
			const request: GetAutoCompleteRequest = {
				autocompleteRequestDto: data,
			};

			const submissionApi = new SubmissionControllerApi(apiConfig);
			return await submissionApi.getAutoComplete(request, { signal });
		},
		enabled: enabled && normalizedQuery.length > 0,
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	return {
		suggestions: queryResult.data || [],
		error: queryResult.error,
		loading: queryResult.isPending,
	};
};

export default useAutoComplete;
