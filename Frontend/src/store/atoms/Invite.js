import { atom } from "recoil";

export const inviteState = atom({
  key: "inviteState",
  default: {
    userExists: null,
    emailId: null,
    boardId: null,
    userId: null,
  },
});
