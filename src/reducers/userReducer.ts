import type {User} from "../interfaces/UserInterface.ts";

export type UserAction =
    | {
    type: "UPDATE_PROFILE"
    payload: Partial<User>
}

const userReducer = (state : User, action: UserAction) => {
    switch (action.type) {
        case "UPDATE_PROFILE":
            return {
                ...state,
                ...action.payload
            }

        default:
            return state
    }
}

export default userReducer;