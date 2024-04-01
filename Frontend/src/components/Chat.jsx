import React from "react";
import { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import io from "socket.io-client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { chatStateFamily } from "../store/atoms/Chat";
import { newNotificationStateFamily } from "../store/atoms/Chat";
import { userState } from "../store/atoms/User";
import ProfileImage from "../assets/profile.jpg";

const Chat = (props) => {
  const [socket, setSocket] = useState(null);
  const [chatList, setChatList] = useRecoilState(
    chatStateFamily(props.boardId)
  );
  const [notificationState, setNotificationState] = useRecoilState(
    newNotificationStateFamily(props.boardId)
  );
  const [messageInput, setMessageInput] = useState("");
  const user = useRecoilValue(userState);

  useEffect(() => {
    // Connect to the server using Socket.IO
    const newSocket = io("ws://localhost:3000", {
      withCredentials: true,
    });
    setSocket(newSocket);

    // Join the board's chat room
    newSocket.emit("joinBoard", props.boardId, user.userId);

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [props.boardId, user.userId]);

  useEffect(() => {
    // Listen for incoming chat messages
    const handleChatMessage = ({ userId, userProfileImage, message }) => {
      setChatList((prevMessages) => [
        ...prevMessages,
        { userId, userProfileImage, message },
      ]);
      setNotificationState(true);
    };

    if (socket) {
      socket.on("chatMessage", handleChatMessage);
    }

    // Clean up event listener on component unmount
    return () => {
      if (socket) {
        socket.off("chatMessage", handleChatMessage);
      }
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket && messageInput.trim() !== "") {
      const userId = user.userId;
      const userProfileImage = user.avatar;
      const boardId = props.boardId;
      socket.emit("chatMessage", {
        boardId,
        userId,
        userProfileImage,
        message: messageInput,
      });
      setMessageInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        {chatList.length === 0 ? (
          <div className="font-body">No messages yet !</div>
        ) : (
          chatList?.map((item, index) => (
            <div
              className={
                item.userId === user.userId
                  ? "chat chat-end"
                  : "chat chat-start"
              }
              key={index}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="" src={item.userProfileImage || ProfileImage} />
                </div>
              </div>
              <div className="chat-bubble">{item.message}</div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center bg-gray-200 px-4 py-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full focus:outline-none bg-white"
          onChange={(e) => setMessageInput(e.target.value)}
          value={messageInput}
        />
        <button
          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full focus:outline-none"
          onClick={sendMessage}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default Chat;
