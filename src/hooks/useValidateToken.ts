import { useCallback } from "react";
import {
	AuthControllerApi,
	type ValidateTokenRequestDto,
} from "../../web-client/src/generated";
import { authConfig } from "../utils/apiConfig";

const useValidateToken = () => {
	const validateToken = useCallback(
		async (token: string, controller: AbortController) => {
			const authController = new AuthControllerApi(authConfig);
			const request: ValidateTokenRequestDto = { token };

			try {
				const response = await authController.validateTokenRaw(
					{ validateTokenRequestDto: request },
					{ signal: controller.signal },
				);
				const status = response.raw.status;

				return status;
			} catch (error: any) {
				const status = error?.response?.status;
				if (status === 401) {
					return 401;
				}
				if (error.name === "AbortError") {
					return;
				}
				throw error;
			}
		},
		[],
	);

	return { validateToken };
};

export default useValidateToken;
