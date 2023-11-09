import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/User";

const PrivateRoute = ({ children, redirectTo }) => {
  const { isLoggedin } = useRecoilValue(userState);
  return isLoggedin ? children : <Navigate to={redirectTo} />;
};

export default PrivateRoute;
