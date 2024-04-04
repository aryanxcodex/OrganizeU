import React from "react";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import { Carousel } from "flowbite-react";
import OrganizeU1 from "../assets/organizeUSamplepic.png";
import OrganizeU2 from "../assets/organizeUSample2.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "flowbite-react";

const HomeScreen = () => {
  return (
    <>
      <Navbar>
        <Hero />
      </Navbar>
      <div className="flex flex-wrap sm:justify-between mx-4 sm:mx-0 bg-base-200">
        <div className="w-full sm:w-1/2 lg:w-1/3 mx-4">
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 my-2">
            <Carousel
              leftControl={
                <Button outline pill>
                  <FaChevronLeft className="h-6 w-6" />
                </Button>
              }
              rightControl={
                <Button outline pill>
                  <FaChevronRight className="h-6 w-6" />
                </Button>
              }
            >
              <img src={OrganizeU1} alt="..." />
              <img src={OrganizeU2} alt="..." />
            </Carousel>
          </div>
        </div>
        <div className="my-3">afdafdasf</div>
      </div>
    </>
  );
};

export default HomeScreen;
