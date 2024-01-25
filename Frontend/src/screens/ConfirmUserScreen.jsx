import React, { useEffect, useState } from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import { Link, useSearchParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/User.js";
import axios from "axios";
import { BASE_USERS_URL } from "../../config.js";
import { toast } from "react-toastify";

const ConfirmUserScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const setUser = useSetRecoilState(userState);

  const token = searchParams.get("token");

  useEffect(() => {
    (async () => {
      if (token) {
        setLoading(true);

        await axios
          .get(`${BASE_USERS_URL}/confirm/${token}`)
          .then((res) => {
            setLoading(false);
            setUser({
              userId: res.data._id,
              username: res.data.name,
              email: res.data.email,
              isLoggedin: true,
            });
          })
          .catch((error) => {
            if (error.response) {
              setLoading(false);
              toast.error(error.response.data.message);
            }
          });
      }
    })();
  }, [token]);

  return (
    <>
      {isLoading ? (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-t-blue-700"></div>
        </div>
      ) : isError ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-xl text-center">
            <HiOutlineXCircle className="text-red-500 w-20 h-20 mx-auto" />
            <p className="mt-2 text-lg text-gray-500">
              Verification was unsuccessful.
            </p>
            <div className="mt-4">
              <button className="btn hover:bg-red-700 hover:text-white text-red-700 font-body">
                <Link to="/">Go Back</Link>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-xl text-center">
            <HiOutlineCheckCircle className="text-green-500 w-20 h-20 mx-auto" />
            <p className="mt-2 text-lg text-gray-500">
              Verification was Successfull !
            </p>
            <div className="mt-4">
              <button className="btn hover:bg-blue-700 hover:text-white text-blue-700 font-body">
                <Link to="/dashboard">Go to Dashboard</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmUserScreen;
