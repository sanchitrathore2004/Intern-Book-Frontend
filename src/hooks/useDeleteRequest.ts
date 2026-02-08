import { useCallback, useState } from "react";
import { AdminControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useDeleteRequest = () => {
	const [error, setError] = useState<Error | string | null>(null);
	const deleteRequest = useCallback(
		async (requestId: number, controller: AbortController) => {
			try {
				const adminControllerApi = new AdminControllerApi(apiConfig);
				await adminControllerApi.deleteRequest({
					requestId: requestId,
				});
			} catch (error) {
				if (error instanceof Error) setError(error);
				else setError("Cannot delete request.");
			}
		},
		[],
	);
	return { deleteRequest, error };
};
export default useDeleteRequest;
