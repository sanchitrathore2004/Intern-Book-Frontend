import { useQuery } from "@tanstack/react-query";
import { CompanyControllerApi,type DomainResponseDto } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const api = new CompanyControllerApi(apiConfig);

const useGetAllDomains = () => {
	return useQuery<DomainResponseDto[], Error>({
		queryKey:["domains"],
		queryFn :async ()=>{
			const res = await api.getAllDomains();
			if(!res) throw new Error("Error fetching domains");
			return res;
		},
		staleTime: 3 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
	}
	)
};

export default useGetAllDomains;
