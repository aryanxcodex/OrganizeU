import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const userState = atom({
  key: "userState",
  default: {
    userId: null,
    username: null,
    email: null,
    isLoggedin: false,
    avatar: null,
  },
  effects_UNSTABLE: [persistAtom],
});
