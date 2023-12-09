import { React, useState, useRef } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import { AiOutlinePlus } from "react-icons/ai";
import { taskState } from "../store/atoms/Tasks";

const Lists = (props) => {
  const [clickFooter, setClickFooter] = useState(false);
  const ref = useRef();
  return (
    <div className="pt-0 py-2">
      <div class="w-72 bg-slate-300 rounded-lg shadow-md p-4 m-2 text-left">
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
          <button className="hover:bg-blue-300 p-2 pl-4 text-left w-5/6 font-body border border-slate-300 rounded-xl">
            <span className="m-1">
              <AiOutlinePlus className="inline" />
            </span>
            Add a Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lists;
