import React from "react";
import { useState } from "react";
import { HiMiniArrowLongRight } from "react-icons/hi2";
import { ImArrowLeft2 } from "react-icons/im";
import { FiMail } from "react-icons/fi";
import Form from "../components/Form";

const OnboardingScreen = () => {
  const [stepClasses, setStepClasses] = useState({
    step1: "step step-primary font-body",
    step2: "step font-body",
    step3: "step font-body",
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleNextClick = () => {
    if (currentStep <= 3) {
      setStepClasses((prevClasses) => ({
        ...prevClasses,
        [`step${currentStep + 1}`]: "step step-primary font-body",
      }));

      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentStep <= 3) {
      if (currentStep == 1) {
        return;
      }

      setStepClasses((prevClasses) => ({
        ...prevClasses,
        [`step${currentStep}`]: "step font-body",
      }));

      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="flex justify-center ">
        <div className="sm:p-8 m-4">
          <ul className="steps sm:mt-8 gap-x-4">
            <li className={stepClasses.step1}>Welcome</li>
            <li className={stepClasses.step2}>SignUp</li>
            <li className={stepClasses.step3}>Confirm Email</li>
          </ul>
        </div>
      </div>
      {currentStep === 1 && (
        <div>
          <div className=" h-screen flex flex-col mt-7 mx-24 items-center">
            <div className="text-blue-700 font-body text-center">
              <h1 className="text-4xl font-body mb-4">
                Welcome to <span className="font-title">OrganizeU</span>
              </h1>
              <p className="text-lg mb-8 text-blue-500">
                Our platform is designed to simplify teamwork and boost
                productivity. Seamlessly manage projects, assign tasks, and
                track progress with your team. Say goodbye to scattered to-do
                lists and hello to organized, efficient collaboration. Let's
                start achieving more together!
              </p>
              <button
                className="hover:bg-blue-700 hover:text-white text-blue-700 font-body btn"
                onClick={handleNextClick}
              >
                Next
                <HiMiniArrowLongRight className="" />
              </button>
            </div>
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <>
          <button
            className="hover:bg-blue-700 hover:text-white text-blue-700 font-body btn"
            onClick={handlePrevClick}
          >
            <ImArrowLeft2 className="" />
            Previous
          </button>
          <Form nextClick={handleNextClick} />
        </>
      )}
      {currentStep === 3 && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <FiMail className="text-blue-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Email Confirmation
            </h2>
            <p className="text-gray-600 mb-4">
              Please check your email to verify your account. Click the
              verification link in the email to proceed to your dashboard.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default OnboardingScreen;
