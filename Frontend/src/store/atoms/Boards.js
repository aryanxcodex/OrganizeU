import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const selectedBoardNameState = atom({
  key: "selectedBoardNameState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
