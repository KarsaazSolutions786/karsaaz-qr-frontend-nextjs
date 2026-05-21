"use client";

import Image from "next/image";
import React from "react";

/**
 * Purpose: Executes ChatbotButton functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function ChatbotButton({ onClick }: { onClick: () => void }) {
  return (
    <>
      <style jsx>{`
        @keyframes bounce-smooth {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .chatbot-bounce {
          animation: bounce-smooth 2s ease-in-out infinite;
        }

        .chatbot-bounce:hover {
          animation-play-state: paused;
        }
      `}</style>

      <button
        onClick={onClick}
        className="chatbot-bounce fixed bottom-6 right-6 z-40 group transition-all duration-300 hover:translate-y-[-1px] cursor-pointer"
      >
        <div className="p-[2px] rounded-full bg-gradient-to-r from-[#CC75EF] to-[#8351E0] shadow-lg group-hover:shadow-xl">
          <div className="bg-white rounded-full pl-2 pr-4 py-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#A27FEE] flex items-center justify-center">
              <Image src="/chatbot.svg" alt="Chatbot" width={20} height={20} />
            </div>
            <span className="text-sm text-gray-700 font-medium">
              Need Help ?
            </span>
          </div>
        </div>
      </button>
    </>
  );
}

