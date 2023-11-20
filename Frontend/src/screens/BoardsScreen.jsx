import React, { useEffect, useState } from "react";
import Cards from "../components/Cards";
import axios from "axios";
import { BASE_BOARDS_URL } from "../../config.js";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";

const BoardsScreen = () => {
  const fetchBoards = async () => {
    return axios.get(`${BASE_BOARDS_URL}/`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  };

  const { isLoading, data } = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  return (
    <div className="flex flex-wrap justify-start gap-6 p-6 overflow-scroll overflow-x-hidden overflow-y-hidden">
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <Skeleton height={75} key={index} containerClassName="flex-1" />
          ))
        : data.data.boards.map((item, index) => (
            <Link to={`/board/${item._id}`}>
              <Cards title={item.title} key={index} />
            </Link>
          ))}
    </div>
  );
};

export default BoardsScreen;
