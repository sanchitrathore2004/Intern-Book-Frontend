import { useCallback, useContext, useEffect } from "react";
import {
	type GetUserResponseDto,
	UserControllerApi,
} from "../../web-client/src/generated";
import UserContext from "../contexts/UserContext";
import { apiConfig } from "../utils/apiConfig";

const useRestoreUser = () => {
	const { dispatch } = useContext(UserContext);

	const userRestore = useCallback(() => {
		const userControllerApi = new UserControllerApi(apiConfig);

		userControllerApi
			.getCurrentUserProfile()
			.then((response: GetUserResponseDto) => {
				dispatch({ type: "UPDATE_PROFILE", payload: response });
			})
			.catch((error) => {
				console.log(error);
			});
	}, [dispatch]);

	useEffect(() => {
		userRestore();
	}, [userRestore]);
};

export default useRestoreUser;
