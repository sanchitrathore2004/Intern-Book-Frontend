import { useCallback, useState } from "react";
import {
	CompanyControllerApi,
	type RoleResponseDto,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";

const useGetAllRoles = () => {
	const [roles, setRoles] = useState<RoleResponseDto[]>([]);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchAllRoles = useCallback(async () => {
		setLoading(true);
		try {
			const companyControllerApi = new CompanyControllerApi(apiConfig);
			const res = await companyControllerApi.getAllRoles();
			setRoles(res ?? []);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error("Failed to fetch companies"));
		} finally {
			setLoading(false);
		}
	}, []);
	return { roles, error, loading, fetchAllRoles };
};

export default useGetAllRoles;
