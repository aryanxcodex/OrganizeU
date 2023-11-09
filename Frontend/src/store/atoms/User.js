import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const userState = atom({
  key: "userState",
  default: {
    username: null,
    email: null,
    isLoggedin: false,
  },
  effects_UNSTABLE: [persistAtom],
});
