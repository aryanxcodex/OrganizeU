import React, { useEffect, useState } from "react";
import Cards from "../components/Cards";
import axios from "axios";
import { BASE_BOARDS_URL } from "../../config.js";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

const BoardsScreen = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await axios
        .get(`${BASE_BOARDS_URL}/boards`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((res) => {
          setLoading(false);
          const boardsData = res.data;
          setBoards(boardsData);
        })
        .catch((error) => {
          setLoading(false);
          if (error.response) {
            toast.error(error.response.data.message);
          }
        });
    })();
  }, []);

  return (
    <div class="flex flex-wrap justify-start gap-6 p-6 overflow-scroll overflow-x-hidden overflow-y-hidden">
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <Skeleton height={75} key={index} containerClassName="flex-1" />
          ))
        : boards.map((item, index) => <Cards title={item.title} id={index} />)}
    </div>
  );
};

export default BoardsScreen;
