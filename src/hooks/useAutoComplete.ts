import { useCallback, useState } from "react";
import {
	type AutoCompleteResponseDto,
	type AutocompleteRequestDto,
	type GetAutoCompleteRequest,
	SubmissionControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useAutoComplete = () => {
	const [suggestions, setSuggestions] = useState<
		Array<AutoCompleteResponseDto> | []
	>([]);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchSuggestions = useCallback(
		async (query: string, controller: AbortController) => {
			setLoading(true);
			setError(null);

			try {
				const data: AutocompleteRequestDto = { query };
				const request: GetAutoCompleteRequest = {
					autocompleteRequestDto: data,
				};

				const submissionApi = new SubmissionControllerApi(apiConfig);

				const res: Array<AutoCompleteResponseDto> =
					await submissionApi.getAutoComplete(request, {
						signal: controller.signal,
					});
				if (!res) throw new Error("Some error occured");

				setSuggestions(res);
				setLoading(false);
			} catch (er) {
				if (er instanceof Error) setError(er);
				else setError(new Error("failed to get Suggestions"));
			}
		},
		[],
	);

	return {
		suggestions,
		error,
		loading,
		setSuggestions,
		fetchSuggestions,
	};
};

export default useAutoComplete;
