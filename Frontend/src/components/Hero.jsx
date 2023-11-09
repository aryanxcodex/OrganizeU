import React from "react";
import HeroImage from "../assets/hero-image.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={HeroImage} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <h1 className="text-5xl font-bold font-body">
            Connecting Teams for Efficient Collaboration
          </h1>
          <p className="py-6 font-body">
            Streamline teamwork with our intuitive task management web app that
            keeps everyone on the same page.
          </p>
          <button className="btn btn-primary font-body"><Link to='/onboard'>Get Started</Link></button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
