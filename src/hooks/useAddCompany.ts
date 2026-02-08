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
			controller: AbortController,
		) => {
			try {
				const adminControllerApi = new AdminControllerApi(apiConfig);
				adminControllerApi.addCompany({
					adminAddCompanyRequestDto: {
						name: companyName,
						logoUrl: companyLogoUrl,
						description: companyDescription,
					},
				});
			} catch (error) {
				if (error instanceof Error) setCompanyError(error);
				else setCompanyError("Cannot add company");
			}
		},
		[],
	);
	return { addCompany, companyError };
};
export default useAddCompany;
