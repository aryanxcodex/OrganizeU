import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/User";
import ProfileImage from "../assets/profile.jpg";
import { HiBars3 } from "react-icons/hi2";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const DashBoardScreen = (props) => {
  const user = useRecoilValue(userState);

  return (
    <>
      <div className="w-full navbar bg-white shadow-lg sticky top-0 z-10">
        <div className="flex-1">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <HiBars3 className="stroke-1 stroke-blue-700" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-xl lg:text-3xl text-blue-700 font-title">
            OrganizeU
          </div>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={ProfileImage} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="lg:flex lg:flex-row h-screen bg-white">
        <div className="hidden lg:flex flex-col w-80 flex-shrink-0 bg-gray-200 p-4 ">
          <div className="my-5 px-6">
            <ul className="space-y-2">
              <li className="text-center font-body">
                <Link
                  to="/dashboard/boards"
                  className="bg-blue-500 text-white rounded-full px-4 py-2 transition-all duration-300 block"
                >
                  My Boards
                </Link>
              </li>
              <li className="text-center font-body">
                <Link
                  to="#"
                  className=" bg-blue-500 text-white rounded-full px-4 py-2 transition-all duration-300 block"
                >
                  Templates
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-hidden">
          <Outlet />
          {props.children}
        </div>
      </div>

      <div className="drawer lg:hidden">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-56 min-h-full bg-base-200 text-base-content">
            <div className="px-2 my-8 text-xl lg:text-xl text-blue-700 font-title select-none">
              OrganizeU
            </div>
            <li>
              <a>My Boards</a>
            </li>
            <li>
              <a>Templates</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default DashBoardScreen;
