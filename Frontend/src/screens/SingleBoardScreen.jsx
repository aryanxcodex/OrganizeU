import { React, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import Lists from "../components/Lists.jsx";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { BASE_CARDS_URL, BASE_USERS_URL } from "../../config.js";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { RiMailSendFill } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import { Button, Navbar, Dropdown, Modal, FloatingLabel } from "flowbite-react";
import { toast, Slide } from "react-toastify";
import { DragDropContext } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import { selectedBoardNameState } from "../store/atoms/Boards.js";

const SingleBoardScreen = () => {
  const { boardId } = useParams();

  const [clickFooter, setClickFooter] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const selectedBoardName = useRecoilValue(selectedBoardNameState);

  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------------------------------------------
  // Mutation for updating the task order
  const updateTaskOrder = useMutation({
    mutationKey: ["updateTaskOrder", boardId],
    mutationFn: (data) => {
      return axios.put(`${BASE_CARDS_URL}/change-task-order`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["board", boardId] });

      const previousList = queryClient.getQueryData(["board", boardId]);

      console.log(previousList);

      // Modifying the cache for quick update on the UI (Optimistic Updates)
      queryClient.setQueryData(["board", boardId], (oldList) => {
        const cardsArray = [...oldList.data.responseObject];
        const sourceCardIndex = cardsArray.findIndex(
          (card) => card._id.toString() === data.sourceId.toString()
        );
        console.log(sourceCardIndex);
        const destinationCardIndex = cardsArray.findIndex(
          (card) => card._id.toString() === data.destinationId.toString()
        );
        console.log(destinationCardIndex);

        const [reorderedItem] = cardsArray[sourceCardIndex].tasks.splice(
          data.sourceIndex,
          1
        );
        console.log(reorderedItem);
        cardsArray[destinationCardIndex].tasks.splice(
          data.destinationIndex,
          0,
          reorderedItem
        );

        return {
          ...oldList,
          data: {
            ...oldList.data,
            responseObject: cardsArray,
          },
        };
      });

      return { previousList };
    },

    onError: async (err, data, context) => {
      //Restoring server state upon error
      await queryClient.setQueryData(["board", boardId], context.previousList);
      toast.error("Something went wrong :( Pls Try Again Later", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },

    onSettled: async () => {
      //Invalidating the query
      await queryClient.invalidateQueries({
        queryKey: ["board", boardId],
      });
    },

    onSuccess: (_, variables) => {
      // toast.success("Changes Updated", {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: true,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      //   transition: Slide,
      // });
    },
  });

  //Gets triggered when a task swap happens
  function handleOnDragEnd(result) {
    console.log(result);

    if (!result.destination) return;

    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return;
    }

    const data = {
      boardId: boardId,
      sourceId: result.source.droppableId,
      sourceIndex: result.source.index,
      destinationId: result.destination.droppableId,
      destinationIndex: result.destination.index,
      taskId: result.draggableId,
    };

    updateTaskOrder.mutate(data);

    console.log(data);
  }

  // ----------------------------------------------------------------------------------------------------------------------------

  //API call for fetching cards and tasks
  const fetchListsnTasks = async () => {
    return axios.get(`${BASE_CARDS_URL}/${boardId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  };

  // -----------------------------------------------------------------------------------------------------------------------------
  //Query for fetching all the cards and tasks of the board
  const { isLoading, data } = useQuery({
    queryKey: ["board", boardId],
    queryFn: async () => {
      const data = await fetchListsnTasks(boardId);
      return data;
    },
  });
  // ------------------------------------------------------------------------------------------------------------------------------
  //Mutation for creating a Card in this specific board
  const createCard = useMutation({
    mutationKey: ["createCard", boardId],
    mutationFn: (data) => {
      return axios.post(`${BASE_CARDS_URL}/create`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["board", boardId] });

      const previousList = queryClient.getQueryData(["board", boardId]);

      setClickFooter(false);

      return { previousList };
    },

    onError: async (err, data, context) => {
      //Restoring server state upon error
      await queryClient.setQueryData(["board", boardId], context.previousList);
      toast.error("Something went wrong :( Pls Try Again Later", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },

    onSettled: async () => {
      //Invalidating the query
      await queryClient.invalidateQueries({
        queryKey: ["board", boardId],
      });
    },

    onSuccess: (_, variables) => {
      toast.success(`Card ${variables.title} was created !`, {
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

  // -----------------------------------------------------------------------------------------------------------------------------
  // Query for fetching the invitation link

  const sendInvitation = useMutation({
    mutationKey: ["invitation", emailInput],
    mutationFn: (data) => {
      return axios.post(`${BASE_USERS_URL}/createInvitation`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },

    onError: () => {
      setOpenModal(false);
      setLoading(false);

      toast.error("Something went wrong :(", {
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

    onSuccess: (_, variables) => {
      setOpenModal(false);
      setLoading(false);

      toast.success(`Invitation was sent`, {
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

  // -----------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (clickFooter) {
      ref.current.focus();
    }
  }, [clickFooter]);

  const handleSubmit = () => {
    if (!cardTitle.trim()) {
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
      title: cardTitle,
      boardId: boardId,
    };
    createCard.mutate(data);
  };

  const validateEmail = (e) => {
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (e.target?.value && e.target.value.match(isValidEmail)) {
      setValidEmail(true);
      setEmailInput(e.target.value);
    } else {
      setEmailInput(e.target.value);
      setValidEmail(false);
    }
  };

  const handleSendInvitation = () => {
    const data = {
      boardId: boardId,
      emailId: emailInput,
    };

    sendInvitation.mutate(data);
    setLoading(true);
  };

  return (
    <>
      <div className="navbar bg-slate-300 shadow-lg rounded-lg">
        <div className="flex-none"></div>
        <div className="flex-1 p-2">
          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Invite to Board {selectedBoardName}</Modal.Header>
            <Modal.Body>
              <FloatingLabel
                variant="outlined"
                label="Email"
                onChange={validateEmail}
                value={emailInput}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={handleSendInvitation}
                disabled={!validEmail}
                processingSpinner={
                  <AiOutlineLoading className="h-6 w-6 animate-spin" />
                }
                isProcessing={loading}
              >
                <RiMailSendFill className="mr-2 h-5 w-5" />
                Send Invitation
              </Button>
            </Modal.Footer>
          </Modal>
          <Dropdown label={selectedBoardName} inline>
            <Dropdown.Item icon={IoMdAdd} onClick={() => setOpenModal(true)}>
              Add Member
            </Dropdown.Item>
            <Dropdown.Item icon={CiSettings}>Settings</Dropdown.Item>
          </Dropdown>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="flex flex-nowrap h-screen overflow-auto">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div className="pt-0 py-2" key={index}>
                  <div className="bg-gray-200 p-4 m-2 w-60 rounded shadow">
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
                  boardId={boardId}
                  tasks={item.tasks}
                ></Lists>
              ))}
          {createCard.isPending && (
            <div className="pt-0 py-2">
              <div className="w-72 bg-slate-300 rounded-lg shadow-md p-4 m-2 text-left">
                <div className="mb-4">
                  <h3>{createCard.variables.title}</h3>
                </div>
                <div className="my-2">
                  <ul className="space-y-2 flex flex-col grow min-h-6"></ul>
                </div>
              </div>
            </div>
          )}
          <div className="pt-0 py-2">
            {clickFooter ? (
              <div className="w-72 m-2 p-4 bg-slate-300 rounded-lg shadow-md">
                <form className="font-body">
                  <textarea
                    type="text"
                    className="w-full border p-2 mb-4 h-20 border-white rounded focus:outline-none text-start resize-none"
                    placeholder="Enter a title for this Card..."
                    ref={ref}
                    onChange={(e) => setCardTitle(e.target.value)}
                  ></textarea>
                  <div className="flex">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center mr-2"
                      onClick={handleSubmit}
                    >
                      Add Card
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
            ) : (
              <Button className="w-72 m-2" onClick={() => setClickFooter(true)}>
                <FaPlus className="mr-2 h-5 w-5" />
                Create New Card
              </Button>
            )}
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default SingleBoardScreen;
