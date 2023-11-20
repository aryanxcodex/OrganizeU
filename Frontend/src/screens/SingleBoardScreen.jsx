import React from "react";
import { useParams } from "react-router-dom";

const SingleBoardScreen = () => {
  let { boardId } = useParams();

  return <div>SingleBoardScreen</div>;
};

export default SingleBoardScreen;
