import { atom } from "recoil";

export const taskState = atom({
  key: "taskState",
  default: [
    {
      id: "heta",
      name: "Heta",
    },
    {
      id: "aryan",
      name: "aryan",
    },
    {
      id: "ganesh",
      name: "ganesh",
    },
    {
      id: "reshma",
      name: "Reshma",
    },
    {
      id: "Diksha",
      name: "Diksha",
    },
  ],
});
