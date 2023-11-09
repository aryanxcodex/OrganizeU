import React from "react";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import { taskState } from "../store/atoms/Tasks";

const Cards = () => {
  const [taskList, setTaskList] = useRecoilState(taskState);

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(taskList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTaskList(items);
  }
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div class="w-72 bg-slate-300 rounded-lg shadow-md p-4 m-2 text-left">
        <div className="mb-4">
          <h3>To Do's</h3>
        </div>
        <div className="my-2">
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="space-y-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {taskList.map(({ id, name, thumb }, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li
                          className="border border-white rounded bg-white p-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>{name}</p>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
        <div className="mt-4">
          <button className="hover:bg-blue-300 p-2 pl-4 text-left w-5/6 font-body border border-slate-300 rounded-xl">
            Add a Task
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Cards;
