import type { GetUserResponseDto, UserDto } from "../../web-client/src/generated/index.ts";

export type UserAction = {
  type: "UPDATE_PROFILE";
  payload: Partial<GetUserResponseDto>;
};

const getProfilePicture = (user: GetUserResponseDto | Partial<GetUserResponseDto>) => {
  if (user.profileUrl) return user.profileUrl;
  else return `https://robohash.org/${user.id}`;
};

const userReducer = (state: GetUserResponseDto, action: UserAction): UserDto => {
  switch (action.type) {
    case "UPDATE_PROFILE": {
      const updatedUser = {
        ...state,
        ...action.payload,
      };

      return {
        ...updatedUser,
        profileUrl: getProfilePicture(updatedUser),
      };
    }

    default:
      return state;
  }
};

export default userReducer;
