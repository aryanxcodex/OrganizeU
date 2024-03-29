import React from "react";
import { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import io from "socket.io-client";

const Chat = () => {
  //   const [socket, setSocket] = useState(null);
  //   const [messages, setMessages] = useState([]);
  //   const [messageInput, setMessageInput] = useState("");
  //   useEffect(() => {
  //     // Connect to the server using Socket.IO
  //     const newSocket = io();
  //     setSocket(newSocket);

  //     // Join the board's chat room
  //     newSocket.emit("joinBoard", boardId);

  //     // Clean up on component unmount
  //     return () => {
  //       newSocket.disconnect();
  //     };
  //   }, [boardId]);

  //   useEffect(() => {
  //     // Listen for incoming chat messages
  //     if (socket) {
  //       socket.on("chatMessage", ({ userId, message }) => {
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           `${userId}: ${message}`,
  //         ]);
  //       });
  //     }

  //     // Clean up event listener on component unmount
  //     return () => {
  //       if (socket) {
  //         socket.off("chatMessage");
  //       }
  //     };
  //   }, [socket]);

  //   const sendMessage = () => {
  //     if (socket && messageInput.trim() !== "") {
  //       // Send chat message to the server
  //       socket.emit("chatMessage", { boardId, message: messageInput });
  //       setMessageInput("");
  //     }
  //   };
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        {/* Sender Message */}
        <div className="flex justify-end mb-4">
          <div className="bg-blue-500 text-white max-w-xs rounded-lg p-4">
            Hello there!
          </div>
        </div>
        {/* Receiver Message */}
        <div className="flex justify-start mb-4">
          <div className="bg-gray-200 text-gray-700 max-w-xs rounded-lg p-4">
            Hi! How can I help you?
          </div>
        </div>
        {/* Add more chat messages here */}
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <div className="chat-bubble">
            It was said that you would, destroy the Sith, not join them.
          </div>
        </div>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <div className="chat-bubble">
            It was you who would bring balance to the Force
          </div>
        </div>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <div className="chat-bubble">Not leave it in Darkness</div>
        </div>
      </div>
      {/* Chat Input */}
      <div className="flex items-center bg-gray-200 px-4 py-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full focus:outline-none bg-white"
        />
        <button className="ml-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full focus:outline-none">
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default Chat;
