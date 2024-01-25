import React from "react";
import { useState } from "react";
import { BASE_USERS_URL } from "../../config.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/User.js";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const setUser = useSetRecoilState(userState);

  const loginUser = async (e) => {
    e.preventDefault();

    setLoading(true);

    await axios
      .post(
        `${BASE_USERS_URL}/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setLoading(false);
        setUser({
          userId: res.data._id,
          username: res.data.name,
          email: res.data.email,
          isLoggedin: true,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.response) {
          setLoading(false);
          toast.error(error.response.data.message);
        }
      });

    setLoading(false);
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <form onSubmit={loginUser}>
            <div className="mb-4">
              <label htmlFor="email" className="text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full py-2 px-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full py-2 px-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn hover:bg-blue-700 hover:text-white text-blue-700 font-body">
              {isLoading == true && (
                <span className="loading loading-spinner"></span>
              )}
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;
