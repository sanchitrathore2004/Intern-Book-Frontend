import { useCallback, useState } from "react";
import { AdminControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useAddCompany = () => {
	const [companyError, setCompanyError] = useState<Error | string | null>(null);

	const addCompany = useCallback(
		async (
			companyName: string,
			companyLogoUrl: string,
			companyDescription: string,
			controller?: AbortController,
		): Promise<boolean> => {
			setCompanyError(null);
			try {
				const adminControllerApi = new AdminControllerApi(apiConfig);
				await adminControllerApi.addCompany(
					{
						adminAddCompanyRequestDto: {
							name: companyName,
							logoUrl: companyLogoUrl,
							description: companyDescription,
						},
					},
					{ signal: controller?.signal },
				);
				return true;
			} catch (error) {
				if (error instanceof Error) {
					if ((error as any).name === "AbortError") {
						return false;
					}
					setCompanyError(error);
				} else {
					setCompanyError("Cannot add company");
				}
				return false;
			}
		},
		[],
	);
	return { addCompany, companyError };
};
export default useAddCompany;
