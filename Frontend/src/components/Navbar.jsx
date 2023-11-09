import React from "react";
import { HiBars3 } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/User";


const Navbar = (props) => {

  const { isLoggedin } = useRecoilValue(userState);

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-white shadow-lg sticky top-0">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <HiBars3 className="stroke-1 stroke-blue-700"/>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-xl lg:text-3xl text-blue-700 font-title">OrganizeU</div>
          <div className="flex-none hidden lg:block px-5">
            <ul className="menu menu-horizontal gap-3">
              {/* Navbar menu content here */}
              <li>
                <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-100 duration-200 hover:bg-blue-700 hover:text-white text-blue-700 font-body"><Link to="/onboard">Get Started</Link></button>
              </li>
              <li>
                <button className="transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-100 duration-200 hover:bg-blue-700 hover:text-white text-blue-700 font-body">{isLoggedin ? <Link to="/dashboard">Dashboard</Link>: <Link to="/login">Login</Link>}</button>
              </li>
            </ul>
          </div>
        </div>
        {/* Page content here */}
        {props.children}
      </div>
      <div className="drawer-side h-screen">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 h-full bg-base-200">
          {/* Sidebar content here */}
          <div className="px-2 my-8 text-xl lg:text-xl text-blue-700 font-title select-none">OrganizeU</div>
          <li>
            <a className="font-body">About Us</a>
          </li>
          <li>
            <a className="font-body">Contact Us</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
