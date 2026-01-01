import { useCallback, useContext, useEffect } from "react"
import { UserControllerApi, type GetUserResponseDto, type UserProfileResponseDto } from "../../web-client/src/generated"
import { apiConfig } from "../utils/apiConfig"
import UserContext from "../contexts/UserContext"

const useRestoreUser = () => {
    const { dispatch } = useContext(UserContext);

    const userRestore = useCallback(() => {
        const userControllerApi = new UserControllerApi(apiConfig);

        userControllerApi.getCurrentUserProfile()
            .then((response: GetUserResponseDto) => {
             dispatch({type: "UPDATE_PROFILE", payload: response})
            }).catch((error) => {
                console.log(error);
            })
    }, []);

    useEffect(()=>{
        userRestore();
    },[userRestore])
}

export default useRestoreUser;