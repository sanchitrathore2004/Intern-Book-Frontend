import { useCallback, useState } from "react";
import { AdminControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useAddCompany = () => {
	const addCompany = useCallback(
		async (
			companyName: string,
			companyLogoUrl: string,
			companyDescription: string,
			controller?: AbortController,
		): Promise<void> => {
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
		},
		[],
	);

	return { addCompany };
};

export default useAddCompany;
