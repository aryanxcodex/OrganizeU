import React from "react";
import { useParams } from "react-router-dom";
import Lists from "../components/Lists.jsx";
import { useQuery } from "@tanstack/react-query";
import { BASE_CARDS_URL } from "../../config.js";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { DragDropContext } from "react-beautiful-dnd";

const SingleBoardScreen = () => {
  const { boardId } = useParams();

  console.log(boardId);

  function handleOnDragEnd(result) {
    console.log(result);
  }

  const fetchListsnTasks = async () => {
    return axios.get(`${BASE_CARDS_URL}/${boardId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  };

  const { isLoading, data } = useQuery({
    queryKey: ["board", boardId],
    queryFn: async () => {
      const data = await fetchListsnTasks(boardId);
      console.log(data);
      return data;
    },
  });

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="flex flex-nowrap h-screen ">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div className="pt-0 py-2">
                <div
                  key={index}
                  className="bg-gray-200 p-4 m-2 w-60 rounded shadow"
                >
                  {Array.from({ length: 5 }).map((__, innerIndex) => (
                    <Skeleton
                      key={innerIndex}
                      height={50}
                      containerClassName="mb-4"
                    />
                  ))}
                </div>
              </div>
            ))
          : data.data.responseObject.map((item, index) => (
              <Lists
                title={item.title}
                key={index}
                _id={item._id}
                tasks={item.tasks}
              ></Lists>
            ))}
      </div>
    </DragDropContext>
  );
};

export default SingleBoardScreen;
