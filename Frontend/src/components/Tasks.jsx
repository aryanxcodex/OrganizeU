import { React, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { CiEdit } from "react-icons/ci";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  TextInput,
  Progress,
  Badge,
  Spinner,
} from "flowbite-react";
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
        status: data.data.returnObject.status,
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
          {taskDetails.isFetching && <Spinner size="md" className=""/>}
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
                <div
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-300 hover:cursor-pointer"
                  onClick={handleEditClick}
                >
                  <CiEdit className="inline-block" fill="black" />
                </div>
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
