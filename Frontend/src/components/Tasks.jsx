import { React, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { CiEdit } from "react-icons/ci";
import { Tooltip, Modal, Spinner } from "flowbite-react";
import { BASE_TASKS_URL } from "../../config.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Tasks = (props) => {
  const [isHover, setHover] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");

  const handleHover = () => {
    setHover((prev) => {
      return !prev;
    });
  };

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

  const taskDetails = useQuery({
    queryKey: ["tasks", props._id],
    queryFn: async () => {
      const data = await axios.get(
        `${BASE_TASKS_URL}/${props.boardId}/${props.cardId}/${props._id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const filteredData = {
        title: data.data.returnObject.title,
        taskStatus: data.data.returnObject.status,
        assignedTo: data.data.returnObject.assignedTo,
      };

      return filteredData;
    },
    enabled: false,
  });

  const handleEditClick = () => {
    setOpenModal(true);
    taskDetails.refetch();
  };

  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          {taskDetails.isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="space-y-6 font-body">
              <div>
                <h4 className="text-xl font-medium text-gray-900 dark:text-white">
                  {taskDetails?.data?.title}
                </h4>
                <p className="text-sm text-gray-500 font-body">
                  Task Completion Status:{" "}
                  <span className="font-body">
                    {taskDetails?.data?.taskStatus}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Assigned Members:
                </h4>
                <ul className="list-disc ml-6">
                  {taskDetails?.data?.assignedTo.length > 0 ? (
                    taskDetails?.data?.assignedTo.map((member, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {member.name}
                      </li>
                    ))
                  ) : (
                    <p>None yet</p>
                  )}
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <Draggable key={props._id} draggableId={props._id} index={props.index}>
        {(draggableProvided) => (
          <li
            className="border border-white rounded bg-white p-1"
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
            key={props._id}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
          >
            <div className="flex items-center justify-between">
              <p>{props.title}</p>
              {isHover && (
                <Tooltip content="Edit" placement="right">
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-300 hover:cursor-pointer"
                    onClick={handleEditClick}
                  >
                    <CiEdit className="inline-block" fill="black" />
                  </div>
                </Tooltip>
              )}
            </div>
            {/* <Progress
              progress={64}
              className=""
              size="sm"
              color="blue"
              progressLabelPosition="inside"
            /> */}
            {/* <div className="pt-1">
              <Badge color="info" className="w-fit">Assigned</Badge>
            </div> */}
          </li>
        )}
      </Draggable>
    </>
  );
};

export default Tasks;
