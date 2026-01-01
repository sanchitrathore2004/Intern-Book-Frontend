import type { UserDto } from "../../web-client/src/generated/index.ts";

export type UserAction = {
  type: "UPDATE_PROFILE";
  payload: Partial<UserDto>;
};

const getProfilePicture = (user: UserDto | Partial<UserDto>) => {
  if (user.profileUrl) return user.profileUrl;
  else return `https://robohash.org/${user.id}`;
};

const userReducer = (state: UserDto, action: UserAction): UserDto => {
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
