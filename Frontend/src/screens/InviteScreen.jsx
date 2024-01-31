import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { BASE_USERS_URL } from "../../config.js";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { inviteState } from "../store/atoms/Invite.js";
import { Button, Label, TextInput } from "flowbite-react";
import { IoIosMail } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { TbPasswordFingerprint } from "react-icons/tb";
import { userState } from "../store/atoms/User.js";

const InviteScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isMutationLoading, setMutationLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const token = searchParams.get("token");

  const invite = useRecoilValue(inviteState);

  const setUser = useSetRecoilState(userState);

  const navigate = useNavigate();

  const setInviteState = useSetRecoilState(inviteState);

  const verifyToken = useMutation({
    mutationKey: ["verifyToken", token],
    mutationFn: (data) => {
      return axios.post(`${BASE_USERS_URL}/checkUserInvitation`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },

    onSuccess: (data) => {
      const { userId, boardId, emailId, userExists } = data.data;
      setInviteState({
        userExists,
        userId,
        boardId,
        emailId,
      });
      setLoading(false);
    },

    onError: () => {
      setLoading(false);
      setError(true);
    },
  });

  useEffect(() => {
    verifyToken.mutate({ token });
  }, []);

  //Login Click Mutation

  // const onboardInvitedUser = useMutation({
  //   mutationKey: ["onboardInvitedUser"],
  //   mutationFn: (data) => {
  //     return axios.post(`${BASE_USERS_URL}/onboardInvitedUser`, data, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       withCredentials: true,
  //     });
  //   },

  //   onSuccess: (data) => {
  // setUser({
  //   userId: data.data._id,
  //   username: data.data.name,
  //   email: data.data.email,
  //   isLoggedin: true,
  // });
  //     toast.success(`Success !`, {
  //       position: "top-center",
  //       autoClose: 2000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Slide,
  //     });
  //   },
  //   onError: () => {
  //     toast.error("Something went wrong :(", {
  //       position: "top-center",
  //       autoClose: 2000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Slide,
  //     });
  //   },
  // });

  const onboardInvitedUser = async (e) => {
    e.preventDefault();

    setMutationLoading(true);

    const data = {
      userExists: invite.userExists,
      emailId: invite.emailId,
      userId: invite.userId,
      boardId: invite.boardId,
      username: username,
      password: password,
    };

    await axios
      .post(`${BASE_USERS_URL}/onboardInvitedUser`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setMutationLoading(false);
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
          setMutationLoading(false);
          toast.error(error.response.data.message);
        }
      });
  };

  // const handleLoginSubmitClick = () => {
  //   if (!password.trim()) {
  //     return;
  //   }

  //   onboardInvitedUser.mutate(data);
  // };

  return (
    <>
      <div className="text-center m-2 flex-1 px-2 mx-2 text-xl lg:text-3xl text-blue-700 font-title">
        OrganizeU
      </div>
      {isLoading ? (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-t-blue-700"></div>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="p-8 bg-white border rounded-md shadow-md">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">Verification Failed. Invalid Token</p>
          </div>
        </div>
      ) : (
        <>
          {invite.userExists ? (
            <>
              <p className="text-xl font-body font-semibold m-16 text-center">
                Seems like you are already a part of our organisation. Please
                login to continue
              </p>
              <div className="mt-10 w-full max-w-md mx-auto p-2">
                <form className="flex max-w-md flex-col gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email1" value="Your email" />
                    </div>
                    <TextInput
                      icon={IoIosMail}
                      id="email1"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      shadow
                      value={invite.emailId}
                      readOnly
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="password1" value="Your password" />
                    </div>
                    <TextInput
                      id="password1"
                      type="password"
                      required
                      shadow
                      icon={TbPasswordFingerprint}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    onClick={onboardInvitedUser}
                    disabled={!password.trim()}
                    processingSpinner={
                      <AiOutlineLoading className="h-6 w-6 animate-spin" />
                    }
                    isProcessing={isMutationLoading}
                  >
                    Submit
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <>
              <p className="text-xl font-body font-semibold m-16 text-center">
                Please be a part of our organisation first
              </p>
              <div className="mt-10 w-full max-w-md mx-auto p-2">
                <form className="flex max-w-md flex-col gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="username" value="Your username" />
                    </div>
                    <TextInput
                      id="username"
                      type="text"
                      placeholder="John Doe"
                      required
                      shadow
                      icon={FaUser}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />

                    <div className="mb-2 block">
                      <Label htmlFor="email1" value="Your email" />
                    </div>
                    <TextInput
                      icon={IoIosMail}
                      id="email1"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      shadow
                      value={invite.emailId}
                      readOnly
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="password1" value="Your password" />
                    </div>
                    <TextInput
                      id="password1"
                      type="password"
                      required
                      shadow
                      icon={TbPasswordFingerprint}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!password.trim() || !username.trim()}
                    processingSpinner={
                      <AiOutlineLoading className="h-6 w-6 animate-spin" />
                    }
                    isProcessing={isMutationLoading}
                    onClick={onboardInvitedUser}
                  >
                    Submit
                  </Button>
                </form>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default InviteScreen;
