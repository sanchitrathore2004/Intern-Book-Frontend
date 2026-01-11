import { useQuery } from "@tanstack/react-query";
import {
	CompanyControllerApi,
	type CompanyPageResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const api = new CompanyControllerApi(apiConfig);

const useGetCompany = (companyId?: number) => {
	return useQuery<CompanyPageResponseDto, Error>({
		queryKey: ["company", companyId],
		queryFn: async () => {
			if (!companyId) {
				throw new Error("Invalid company id");
			}
			const res = await api.getCompany({ companyId });
			if (!res) throw new Error("Some error occurred");
			return res;
		},
		enabled: !!companyId,
		staleTime: 2 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
};

export default useGetCompany;
