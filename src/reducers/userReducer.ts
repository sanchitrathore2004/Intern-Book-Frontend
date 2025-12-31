import type { UserDto } from "../../web-client/src/generated/index.ts";

export type UserAction = {
	type: "UPDATE_PROFILE";
	payload: Partial<UserDto>;
};

const userReducer = (state: UserDto, action: UserAction) => {
	switch (action.type) {
		case "UPDATE_PROFILE":
			return {
				...state,
				...action.payload,
			};

		default:
			return state;
	}
};

export default userReducer;
