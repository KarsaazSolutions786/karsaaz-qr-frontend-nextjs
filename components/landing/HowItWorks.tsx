import React, { useState } from "react";
import Image from "next/image";

interface StepProps {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  onHover: (index: number) => void;
}

/**
 * Purpose: Executes Step functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
const Step = ({ number, title, description, isActive, onHover }: StepProps) => {
  return (
    <div
      className="flex items-start pb-6 cursor-pointer transition-all duration-300"
      onMouseEnter={() => onHover(number - 1)}
    >
      <div className="flex flex-col items-center mr-6">
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full transition-all duration-300 ${
            isActive ? "bg-purple-600 scale-110" : "bg-slate-400"
          }`}
        ></div>
      </div>
      <div className="-mt-2">
        <h3
          className={`text-2xl font-bold transition-all duration-300 ${
            isActive
              ? "text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text"
              : "text-gray-700"
          }`}
          style={
            isActive
              ? {
                  background:
                    "linear-gradient(90.77deg, #B048B0 9.76%, #A550B9 31.16%, #8073E0 98.02%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }
              : {}
          }
        >
          {title}
        </h3>
        <p
          className={`mt-2 text-lg transition-all duration-300 ${
            isActive ? "text-gray-800" : "text-gray-600"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

/**
 * Purpose: Executes HowItWorks functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Register via Site",
      description: "Register to Karsaaz QR with google or Email.",
      image: "/img/laptop/MacBook Air (15 inch) (3).png",
    },
    {
      title: "Choose the type",
      description: "Choose the type of QR code you want to create.",
      image: "/img/laptop/MacBook Air (15 inch) (2).png",
    },
    {
      title: "Create QR Code",
      description: "Create your QR code with the details.",
      image: "/img/laptop/MacBook Air (15 inch) (1).png",
    },
    {
      title: "Customise and Download",
      description: "Customise your QR code and Download it.",
      image: "/img/laptop/MacBook Air (15 inch) (1).png",
    },
  ];

  return (
    <section
      id="how-to"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column: Steps */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight leading-tight">
              Quick Steps To Generate QR
              <br />
              <span className="text-gray-600">using</span>{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  background:
                    "linear-gradient(90.77deg, #B048B0 9.76%, #A550B9 31.16%, #8073E0 98.02%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                Karsaaz QR
              </span>
            </h2>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <Step
                  key={index}
                  number={index + 1}
                  title={step.title}
                  description={step.description}
                  isActive={activeStep === index}
                  onHover={setActiveStep}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Laptop Image */}
          <div className="relative flex justify-center items-center h-[800px] hidden md:flex">
            {/* Background Gradient */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-3xl blur-3xl opacity-30"></div> */}

            {/* Laptop Images with Transition */}
            <div className="relative w-full h-full flex items-center justify-center">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                    activeStep === index
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 translate-y-4"
                  }`}
                >
                  <Image
                    src={step.image}
                    alt={`${step.title} - Karsaaz QR Interface`}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

