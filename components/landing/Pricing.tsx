"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/**
 * Purpose: Executes Pricing functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();

  const pillButtonStyle = {
    width: "200px",
    height: "50px",
    paddingLeft: 20.1,
    paddingRight: 20.1,
    paddingTop: 22.05,
    paddingBottom: 22.05,
    background:
      "radial-gradient(ellipse 85.59% 107.08% at 86.30% 87.50%, rgba(0, 0, 0, 0.23) 0%, rgba(0, 0, 0, 0) 86%), radial-gradient(ellipse 83.94% 83.94% at 26.39% 20.83%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 70%, rgba(255, 255, 255, 0) 100%), #8073E0",
    boxShadow:
      "3.3924050331115723px 32.227848052978516px 52.582279205322266px rgba(0, 0, 0, 0.20)",
    borderRadius: 92.44,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8.48,
    color: "rgba(255, 255, 255, 0.70)",
    fontSize: 15.66,
    fontFamily: "Inter",
    fontWeight: 400,
    textShadow: "1px 1px 1px rgba(0, 0, 0, 0.25)",
    border: "none",
  };

  const whitePillStyle = {
    width: "150px",
    height: "50px",
    background: "#FFFFFF",
    borderRadius: 92.44,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15.66,
    fontFamily: "Inter",
    fontWeight: 400,
    color: "#8073E0",
    boxShadow:
      "3.39px 32.23px 52.58px 0px #00000033, -2.54px -3.39px 5.94px 0px #FFFFFF26 inset",
    border: "none",
  };

  const plans = [
    {
      name: "Basic",
      monthlyPrice: 9,
      yearlyPrice: 90,
      features: [
        "50 QR Codes per month",
        "Basic QR Code types",
        "Standard templates",
        "Basic analytics",
        "Email support",
      ],
      isPopular: false,
      buttonStyle: {
        background: `linear-gradient(0deg, #8073E0, #8073E0),
          radial-gradient(65.28% 65.28% at 26.39% 20.83%, rgba(255, 255, 255, 0.413) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%),
          radial-gradient(92.09% 85.42% at 86.3% 87.5%, rgba(0, 0, 0, 0.23) 0%, rgba(0, 0, 0, 0) 86.18%)`,
        boxShadow: `3.39px 32.23px 52.58px 0px #00000033, -2.54px -3.39px 5.94px 0px #FFFFFF26 inset`,
        color: "white",
      },
    },
    {
      name: "Standard",
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        "500 QR Codes per month",
        "All QR Code types",
        "Premium templates",
        "Advanced analytics",
        "Custom branding",
        "Priority support",
        "Bulk generation",
      ],
      isPopular: true,
      buttonStyle: {
        background: "white",
        boxShadow: `3.39px 32.23px 52.58px 0px #00000033, -2.54px -3.39px 5.94px 0px #FFFFFF26 inset`,
        color: "#8073E0",
      },
      cardStyle: {
        background: "linear-gradient(180deg, #B048B0 8.1%, #8073E0 100.06%)",
      },
    },
    {
      name: "Premium",
      monthlyPrice: 39,
      yearlyPrice: 390,
      features: [
        "Unlimited QR Codes",
        "All QR Code types",
        "Custom templates",
        "Advanced analytics & insights",
        "White-label solution",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
      ],
      isPopular: false,
      buttonStyle: {
        background: `linear-gradient(0deg, #8073E0, #8073E0),
          radial-gradient(65.28% 65.28% at 26.39% 20.83%, rgba(255, 255, 255, 0.413) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%),
          radial-gradient(92.09% 85.42% at 86.3% 87.5%, rgba(0, 0, 0, 0.23) 0%, rgba(0, 0, 0, 0) 86.18%)`,
        boxShadow: `3.39px 32.23px 52.58px 0px #00000033, -2.54px -3.39px 5.94px 0px #FFFFFF26 inset`,
        color: "white",
      },
    },
  ];

  return (
    <section id="pricing" className="relative py-20 px-6 overflow-hidden">
      {/* Purple Gradient Background */}
      <div
        className="absolute inset-0 h-[463]"
        style={{
          background:
            "linear-gradient(105.27deg, rgba(176, 72, 176, 0.6) 16.17%, rgba(128, 115, 224, 0.3) 87.53%)",
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span
              className="bg-clip-text text-transparent"
              style={{
                background:
                  "linear-gradient(90.77deg, #B048B0 0%, #A550B9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Choose Your{" "}
            </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                background:
                  "linear-gradient(90.77deg, #A550B9 0%, #8073E0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              QR Plan
            </span>
          </h2>
          <p className="text-lg mb-8">
            Start with our free trial. Upgrade anytime to unlock more features.
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg font-medium `}>Monthly</span>
            <motion.button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-16 h-8 rounded-full p-1 transition-colors duration-300"
              style={{
                background: "linear-gradient(90deg, #BB9DF3 0%, #8351E0 100%)",
              }}
            >
              <motion.div
                animate={{ x: isYearly ? 32 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-6 h-6 bg-white rounded-full shadow-md"
              />
            </motion.button>
            <span className={`text-lg font-medium `}>Yearly</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col items-start h-full ${
                plan.isPopular
                  ? "text-white transform scale-105 shadow-2xl"
                  : "bg-white text-gray-800 shadow-xl hover:shadow-2xl"
              }`}
              style={plan.isPopular && plan.cardStyle ? plan.cardStyle : {}}
            >
              {/* Plan Name */}
              <h3 className="text-2xl font-bold mb-6">{plan.name}</h3>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">
                    $
                    {isYearly
                      ? Math.floor(plan.yearlyPrice / 12)
                      : plan.monthlyPrice}
                  </span>
                  <span className="text-lg ml-2 opacity-70">/month</span>
                </div>
                {isYearly && (
                  <div className="text-sm opacity-70 mt-1">
                    Billed annually (${plan.yearlyPrice}/year)
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center space-x-3"
                  >
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${
                        plan.isPopular ? "text-white" : "text-blue-500"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Buy Button */}
              <div className="w-full flex justify-center mt-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/signup")}
                  className="py-4 rounded-full font-semibold text-lg transition-all duration-300"
                  style={plan.isPopular ? whitePillStyle : pillButtonStyle}
                >
                  Buy Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl"></div>
    </section>
  );
}

