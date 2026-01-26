import { useQuery } from "@tanstack/react-query";
import {
	CompanyControllerApi,
	type CompanyResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const api = new CompanyControllerApi(apiConfig);

const useGetAllCompany = () => {
	return useQuery<CompanyResponseDto[], Error>({
		queryKey: ["companies"],
		queryFn: async () => {
			const res = await api.getAllCompanies();
			if (!res) throw new Error("Some error occurred");
			return res;
		},
		staleTime: 3 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
	});
};

export default useGetAllCompany;
