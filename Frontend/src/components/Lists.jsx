import { React, useState, useRef, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_TASKS_URL } from "../../config.js";
import { toast, Slide } from "react-toastify";
import Tasks from "./Tasks.jsx";
import axios from "axios";

const Lists = (props) => {
  const [clickFooter, setClickFooter] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const ref = useRef(null);

  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationKey: ["createTask", props._id],
    mutationFn: (data) => {
      return axios.post(`${BASE_TASKS_URL}/create`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["board", props.boardId] });

      const previousList = queryClient.getQueryData(["board", props.boardId]);

      setClickFooter(false);

      return { previousList };
    },

    onError: async (err, data, context) => {
      await queryClient.setQueryData(
        ["board", props.boardId],
        context.previousList
      );
      toast.error("Something went wrong :( Pls Try Again Later", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["board", props.boardId],
      });
    },

    onSuccess: (_, variables) => {
      toast.success(`Task ${variables.title} was created !`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    },
  });

  const handleSubmit = () => {
    if (!taskTitle.trim()) {
      toast.error("Title cannot be empty", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      setClickFooter(false);
      return;
    }
    const data = {
      title: taskTitle,
      cardId: props._id,
      boardId: props.boardId,
    };
    createTask.mutate(data);
  };

  useEffect(() => {
    if (clickFooter) {
      ref.current.focus();
    }
  }, [clickFooter]);
  return (
    <>
      <div className="pt-0 py-2">
        <div className="w-72 bg-slate-300 rounded-lg shadow-md p-4 m-2 text-left">
          <div className="mb-4">
            <h3>{props.title}</h3>
          </div>
          <div className="my-2">
            <Droppable
              droppableId={props._id}
              direction="vertical"
              key={props._id}
            >
              {(droppableProvided) => {
                return (
                  <ul
                    className="space-y-2 flex flex-col grow min-h-6"
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    {props.tasks.map(({ title, _id }, index) => {
                      return (
                        <Tasks _id={_id} index={index} title={title} key={_id}></Tasks>
                      );
                    })}
                    {createTask.isPending && (
                      <Tasks title={createTask.variables.title}></Tasks>
                    )}
                    {droppableProvided.placeholder}
                  </ul>
                );
              }}
            </Droppable>
          </div>
          <div className="mt-4">
            {clickFooter && (
              <div className="mt-4">
                <form className="font-body">
                  <textarea
                    type="text"
                    className="w-full border p-2 mb-4 h-20 border-white rounded focus:outline-none text-start resize-none"
                    placeholder="Enter a title for this Task..."
                    ref={ref}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  ></textarea>
                  <div className="flex">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center mr-2"
                      onClick={handleSubmit}
                    >
                      Add Task
                      {createTask.isPending && (
                        <span className="loading loading-spinner loading-sm ml-2"></span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="text-gray-600 px-4 py-2 rounded"
                      onClick={() => setClickFooter(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            {!clickFooter && (
              <button
                className="hover:bg-blue-300 p-2 pl-4 text-left w-5/6 font-body border border-slate-300 rounded-xl"
                onClick={() => setClickFooter(true)}
              >
                <span className="m-1">
                  <AiOutlinePlus className="inline" />
                </span>
                Add a Task
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Lists;
