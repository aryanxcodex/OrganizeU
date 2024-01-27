import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { BASE_USERS_URL } from "../../config.js";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { inviteState } from "../store/atoms/Invite.js";
import { Button, Spinner, Label, TextInput } from "flowbite-react";
import { IoIosMail } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { TbPasswordFingerprint } from "react-icons/tb";

const InviteScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [validEmail, setValidEmail] = useState(false);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoadingEmail, setLoadingEmail] = useState(false);
  const [password, setPassword] = useState("");

  const token = searchParams.get("token");

  const invite = useRecoilValue(inviteState);

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
      setError(true);
    },
  });

  useEffect(() => {
    verifyToken.mutate({ token });
  }, []);

  const validateEmail = (e) => {
    setEmail(e.target.value);

    setTimeout(() => {}, 1000);

    setLoadingEmail(true);

    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (e.target?.value && e.target.value.match(emailRegex)) {
        setValidEmail(true);
      } else {
        setValidEmail(false);
      }
      setLoadingEmail(false);
    }, 1000);
  };

  return (
    <>
      <div className="text-center m-2 flex-1 px-2 mx-2 text-xl lg:text-3xl text-blue-700 font-title">
        OrganizeU
      </div>
      {isLoading ? (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-t-blue-700"></div>
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
                      onChange={validateEmail}
                      color={validEmail ? "success" : "error"}
                      helperText={
                        isLoadingEmail ? (
                          <Spinner
                            aria-label="Extra small spinner example"
                            size="xs"
                          />
                        ) : validEmail ? (
                          "Looks Good !"
                        ) : (
                          "Invalid Email"
                        )
                      }
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
                  <Button type="submit">Submit</Button>
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
                      onChange={validateEmail}
                      color={validEmail ? "success" : "error"}
                      helperText={
                        isLoadingEmail ? (
                          <Spinner
                            aria-label="Extra small spinner example"
                            size="xs"
                          />
                        ) : validEmail ? (
                          "Looks Good !"
                        ) : (
                          "Invalid Email"
                        )
                      }
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
                  <Button type="submit">Submit</Button>
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
