import { useCallback, useState } from "react";
import {
	CompanyControllerApi,
	type DomainResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetAllDomains = () => {
	const [domains, setDomains] = useState<DomainResponseDto[]>([]);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchAllRoles = useCallback(async () => {
		setLoading(true);
		try {
			const companyControllerApi = new CompanyControllerApi(apiConfig);
			const res = await companyControllerApi.getAllDomains();
			setDomains(res ?? []);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error("Failed to fetch companies"));
		} finally {
			setLoading(false);
		}
	}, []);
	return { domains, error, loading, fetchAllRoles };
};

export default useGetAllDomains;
