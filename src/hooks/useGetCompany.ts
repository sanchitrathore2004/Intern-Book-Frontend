import { useCallback, useState } from "react";
import {
	CompanyControllerApi,
	type CompanyPageResponseDto,
	type GetCompanyRequest,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetCompany = () => {
	const [company, setCompany] = useState<CompanyPageResponseDto | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchCompanyDetails = useCallback(
		async (companyId: number, controller: AbortController) => {
			setLoading(true);
			setError(null);

			try {
				const companyControllerApi = new CompanyControllerApi(apiConfig);
				const request: GetCompanyRequest = { companyId };

				const res: CompanyPageResponseDto =
					await companyControllerApi.getCompany(request, {
						signal: controller.signal,
					});

				if (!res) throw new Error("Some error occured");

				setCompany(res);
				setLoading(false);
			} catch (er) {
				if (er instanceof Error) setError(er);
				else setError(new Error("failed to get Submission"));
			}
		},
		[],
	);

	return {
		company,
		setCompany,
		error,
		loading,
		fetchCompanyDetails,
	};
};

export default useGetCompany;
