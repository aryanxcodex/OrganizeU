import { React, useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Tooltip, Modal, Spinner, Avatar } from "flowbite-react";
import { BASE_TASKS_URL } from "../../config.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Dropdown } from "flowbite-react";
import useBoardMembers from "../hooks/useBoardMembers.js";
import ProfileImage from "../assets/profile.jpg";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/User.js";

const Tasks = (props) => {
  const [isHover, setHover] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const userDetails = useRecoilValue(userState);

  const handleHover = () => {
    setHover((prev) => {
      return !prev;
    });
  };

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  const boardMembers = useBoardMembers(props.boardId);

  const isOwner = boardMembers?.data?.data?.response?.some(
    (member) =>
      member.role === "owner" && member.user._id === userDetails.userId
  );

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

  const filteredBoardMembers = boardMembers?.data?.data?.response?.filter(
    (item) =>
      !taskDetails?.data?.assignedTo.some(
        (member) => member._id === item.user._id
      )
  );

  // useEffect(() => {
  //   console.log(filteredBoardMembers);
  // }, []);

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
                <h4 className="text-xl font-medium text-gray-900 dark:text-white whitespace-normal break-all">
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
                      <div className="flex items-center mt-2">
                        <img
                          src={member.avatar || ProfileImage}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>{member.name}</span>
                      </div>
                    ))
                  ) : (
                    <p>None yet</p>
                  )}
                </ul>
              </div>
              {/* Section to assign task to members */}
              {isOwner && (
                <div className="mt-6">
                  <div className="mb-3">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      Assign Task to Members:
                    </h4>
                  </div>
                  <Dropdown label="Assign Task" placement="down">
                    {boardMembers.isLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <Spinner size="md" />
                      </div>
                    ) : filteredBoardMembers?.filter(
                        (member) => member.role !== "owner"
                      ).length > 0 ? (
                      filteredBoardMembers
                        ?.filter((member) => member.role !== "owner")
                        .map((member, index) => (
                          <div
                            className="flex items-center p-2"
                            key={index}
                            onClick={() => {
                              handleMemberSelect(member);
                            }}
                          >
                            <img
                              src={member.user.avatar || ProfileImage}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <Dropdown.Item key={index} className="inline">
                              {member.user.name}
                            </Dropdown.Item>
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center p-2">
                        <Dropdown.Item className="inline">
                          No Members Found
                        </Dropdown.Item>
                      </div>
                    )}
                  </Dropdown>
                  <div className="mt-4">
                    <p className="text-lg font-medium">Selected Member:</p>
                    {selectedMember ? (
                      <div className="flex items-center mt-2">
                        <img
                          src={selectedMember.user.avatar || ProfileImage}
                          className="w-8 h-8 rounded-full mr-2"
                          alt={`Avatar of ${selectedMember.user.name}`}
                        />
                        <span>{selectedMember.user.name}</span>
                      </div>
                    ) : (
                      <p>No member selected</p>
                    )}
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full mt-4 focus:outline-none"
                    // onClick={assignTask}
                  >
                    Assign Task
                  </button>
                </div>
              )}
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
              <p className="whitespace-normal break-all">{props.title}</p>
              {isHover && (
                <Tooltip content="Info" placement="right">
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-300 hover:cursor-pointer"
                    onClick={handleEditClick}
                  >
                    <IoIosInformationCircleOutline />
                  </div>
                </Tooltip>
              )}
            </div>
          </li>
        )}
      </Draggable>
    </>
  );
};

export default Tasks;
