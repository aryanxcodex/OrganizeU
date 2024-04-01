import { atomFamily } from "recoil";

export const chatStateFamily = atomFamily({
  key: "chatStateFamily",
  default: [],
});

export const newNotificationStateFamily = atomFamily({
  key: "notification",
  default: false,
});
