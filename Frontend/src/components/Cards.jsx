import React from "react";

const Cards = (props) => {
  return (
    <div className="max-w-md bg-cover bg-center bg-blue-200 rounded-md overflow-hidden shadow-md">
      <div className="h-full p-6 flex flex-col justify-end">
        <h3 className="text-white text-lg font-semibold">{props.title}</h3>
      </div>
    </div>
  );
};

export default Cards;
