import { React, useState, useRef, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import { AiOutlinePlus } from "react-icons/ai";
// import { taskState } from "../store/atoms/Tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_TASKS_URL } from "../../config.js";
import { toast } from "react-toastify";
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", props.boardId] });
      setTaskTitle('');
      setClickFooter(false)
      toast.success("The task was created !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },

    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = () => {
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
                      <Draggable key={_id} draggableId={_id} index={index}>
                        {(draggableProvided) => (
                          <li
                            className="border border-white rounded bg-white p-2"
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                          >
                            <p>{title}</p>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
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
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSubmit}
                >
                  Add Card
                  {createTask.isPending && (
                    <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                  )}
                </button>
                <button
                  type="button"
                  className="text-gray-600 ml-2"
                  onClick={() => setClickFooter(false)}
                >
                  Cancel
                </button>
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
  );
};

export default Lists;
