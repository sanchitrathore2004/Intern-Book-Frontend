import { useCallback, useState } from "react";
import {
	AdminControllerApi,
	type GetAllRequestResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetAllRequests = () => {
	const [requestError, setRequestError] = useState<Error | string | null>(null);

	const getAllRequests = useCallback(
		async (
			controller?: AbortController,
		): Promise<GetAllRequestResponseDto[] | undefined> => {
			setRequestError(null);
			try {
				const adminControllerApi = new AdminControllerApi(apiConfig);
				const response: GetAllRequestResponseDto[] =
					await adminControllerApi.getAllRequests({
						signal: controller?.signal,
					});
				return response;
			} catch (error) {
				if (error instanceof Error) {
					if ((error as any).name === "AbortError") return undefined;
					setRequestError(error);
				} else setRequestError("Cannot fetch requests.");
			}
		},
		[],
	);
	return { getAllRequests, requestError };
};
export default useGetAllRequests;
