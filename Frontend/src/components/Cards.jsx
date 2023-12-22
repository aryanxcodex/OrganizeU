import React from "react";

const Cards = (props) => {
  return (
    <div className="max-w-md bg-cover bg-center bg-blue-200 rounded-md overflow-hidden shadow-md  transition-transform transform hover:scale-105">
      <div className="h-full p-6 flex items-center justify-start">
        {props.children}
        <h3 className="text-white text-lg font-semibold ml-2">{props.title}</h3>
      </div>
    </div>
  );
};

export default Cards;
