import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_BOARDS_URL } from "../../config";

const useBoardMembers = (boardId) => {
  return useQuery({
    queryKey: ["members", boardId],
    queryFn: async () => {
      const data = await axios.get(`${BASE_BOARDS_URL}/${boardId}/getMembers`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return data;
    },
  });
};

export default useBoardMembers;
