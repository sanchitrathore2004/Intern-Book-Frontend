import { useCallback, useState } from "react";
import {
	CompanyControllerApi,
	type CompanyResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetAllCompany = () => {
	const [companies, setCompanies] = useState<CompanyResponseDto[]>([]);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchAllCompany = useCallback(async () => {
		setLoading(true);
		try {
			const companyControllerApi = new CompanyControllerApi(apiConfig);
			const res = await companyControllerApi.getAllCompanies();
			setCompanies(res ?? []);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error("Failed to fetch companies"));
		} finally {
			setLoading(false);
		}
	}, []);
	return { companies, error, loading, fetchAllCompany };
};

export default useGetAllCompany;
