"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  User,
  SendHorizonal,
  Loader2,
  SendHorizontal,
} from "lucide-react";
import Turnstile from "react-cloudflare-turnstile";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { botAPI } from "@/lib/landing/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [escalation, setEscalation] = useState<string | null>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Do not add any message on open; message will be added after Cloudflare success
  }, [isOpen]);

  const cloudflareTrustHandler = async (turnstileToken: string) => {
    try {
      const res = await fetch("/api/verify-turnstile", {
        // Use your API route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });

      const data = await res.json();
      return data.success; // Return the success status
    } catch (error) {
      console.error("Turnstile verification failed", error);
      return false;
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;

    setIsLoading(true);
    try {
      setIsEmailSubmitted(true);
      setShowEmailForm(false);
      setShowFAQ(true);

      // After email, send greeting message as shown in the design
      const instructionMessage: Message = {
        id: "3",
        text: "Hello, I'm It's Bot! I'm your personal sport assistant. How can I help you?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, instructionMessage]);
    } catch (error) {
      console.error("Email submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFAQClick = (faqText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: faqText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Bot response based on FAQ
    setTimeout(async () => {
      let botResponse = "";
      switch (faqText) {
        case "What is Karsaaz QR and how does it work ??":
          botResponse = `Karsaaz QR is an enterprise-grade QR code platform that lets you create, customize, and manage dynamic and static QR codes for every purpose from digital menus and product catalogs to business profiles and payment links.
          Unlike ordinary generators, Karsaaz QR runs on a secure architecture with cloud-hosted analytics, allowing real-time content editing even after printing.
          Each QR can carry:
          ● Files (PDF, images, videos)
          ● Links & social profiles (Instagram, LinkedIn, WhatsApp, Maps, etc.)
          ● Dynamic business pages or feedback forms
          ● Encrypted, time-limited, or single-use access links
          Karsaaz QR’s backend automatically logs every scan (location, device, timestamp) and visualizes it through interactive analytics and heatmaps, giving businesses real insight into how, where, and when their QRs are performing.`;
          break;

        case "What makes Karsaaz QR different from other QR generators?":
          botResponse = `Most QR tools focus only on basic URL redirection — Karsaaz QR is a complete QR ecosystem built for data-driven, brand-controlled experiences.
          Here’s what sets it apart:
          ● Dynamic Control: Change your content anytime without reprinting.
          ● Analytics Intelligence: Track scans by location, device, and campaign.
          ● Design Freedom: Add colors, gradients, logos, and custom templates with live preview.
          ● Security Layers: Add PINs, expiry timers, encryption, and single-use options for sensitive data.
          ● Enterprise Modules: Create folders, share team libraries, assign user roles, and manage campaigns collaboratively.
          ● API Access: Integrate QR generation and analytics directly into your own applications or CRMs.
          Every feature is modular and scalable from personal use to large corporate deployment — backed by AES-256 encryption, SSL-secured links, and PECA 2025 + GDPR-compliant architecture.`;
          break;

        case "Is Karsaaz QR secure and compliant for businesses?":
          botResponse = `Yes, security and compliance are core to Karsaaz QR’s architecture.
          The system follows ISO 27001, ISO 9001, GDPR, PDPL, and PECA 2025 frameworks, ensuring every QR, scan, and file transfer meets enterprise-grade data protection standards.
          Security highlights:
          ● AES-256 encryption for all data in transit and at rest.
          ● Signed URLs with expiry and access logs for file-based QRs.
          ● Multi-factor authentication for admin and enterprise dashboards.
          ● Dedicated compliance monitoring for audit trails and breach alerts.
          Whether you’re sharing a business card, a digital catalog, or a confidential document, every QR created on Karsaaz QR is protected by a fully auditable, encrypted backend. This makes the platform ideal for regulated sectors including finance, healthcare, and government services where secure document access and traceability are mandatory.`;
          break;

        case "What pricing plans and benefits does Karsaaz QR offer?":
          botResponse = `Karsaaz QR offers three flexible subscription plans designed to fit every use case:
          Basic Plan
          ● $9/month or $7/month (billed annually at $90/year)
          ● 50 QR Codes per month
          ● Basic QR Code types
          ● Standard templates
          ● Basic analytics
          ● Email support
          
          Standard Plan
          ● $19/month or $15/month (billed annually at $190/year)
          ● 500 QR Codes per month
          ● All QR Code types
          ● Premium templates
          ● Advanced analytics & custom branding
          ● Priority support
          ● Bulk QR generation
          
          Premium Plan
          ● $39/month or $32/month (billed annually at $390/year)
          ● Unlimited QR Codes
          ● All QR Code types
          ● Custom templates
          ● Advanced analytics & insights
          ● White-label solution & API access
          ● Dedicated account manager
          ● Custom integrations
          
          All plans include:
          ● Secure cloud infrastructure
          ● Real-time analytics dashboard
          ● GDPR & PECA 2025 compliance
          ● Upgrade/downgrade flexibility with no hidden fees
          
          Karsaaz QR ensures that whether you’re a freelancer, brand, or enterprise, you get scalable tools and professional-grade performance with every plan.`;
          break;

        default:
          botResponse =
            "That's a great question! I'm here to help you with any questions about Karsaaz AI. Could you please provide more details about what you'd like to know?";
      }

      // Stream the FAQ answer like GPT typing
      await streamBotResponse(botResponse);
    }, 400);
  };


  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isEmailSubmitted) return;

    // If an escalation prompt (Yes/No) is showing, dismiss it when user asks a new question
    if (escalation) {
      setEscalation(null);
    }
    // Hide FAQs after any user message
    setShowFAQ(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // If the message is one of predefined FAQs, reuse that flow
      const predefined = [
        "What is Karsaaz QR and how does it work ??",
        "What makes Karsaaz QR different from other QR generators?",
        "Is Karsaaz QR secure and compliant for businesses?",
        "What pricing plans and benefits does Karsaaz QR offer?",
      ];

      if (predefined.includes(userMessage.text)) {
        handleFAQClick(userMessage.text);
        setIsLoading(false);
        return;
      }

      // Call external bot API for other questions
      const productTag = "QR"; // default tag
      const responseText = await botAPI.getResponse({
        email,
        query: userMessage.text,
        product_tag: productTag,
      });

      // Stop loading indicator before streaming characters to avoid duplicate typing bubbles
      setIsLoading(false);
      const normalizedResp = (responseText || "").trim();
      if (normalizedResp === "LIMITREACHED") {
        setEscalation("limit");
        await streamBotResponse(
          "Your daily limit is reached. If you want to chat with our agent, please generate the ticket. Would you like to proceed?",
          { showFaqOnComplete: false }
        );
      } else if (
        normalizedResp.toLowerCase() === "flag" ||
        /"flag"/i.test(normalizedResp)
      ) {
        setEscalation("flag");
        await streamBotResponse(
          "This task is not possible for the LLM. If you want to continue the chat with our agent, please generate the ticket. Would you like to proceed?",
          { showFaqOnComplete: false }
        );
      } else {
        await streamBotResponse(
          responseText || "Sorry, I couldn't get a response right now.",
          { showFaqOnComplete: false }
        );
      }
    } catch (err) {
      const errMessage = (err as Error)?.message || "Failed to fetch response. Please try again.";
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        text: errMessage,
        sender: "bot",
        timestamp: new Date(),
      }]);
    } finally {
      // Ensure loading is not stuck in edge cases
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isEmailSubmitted) {
        handleSendMessage();
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderMessageText = (text: string) => {
    const splitRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
    const urlStartRegex = /^(https?:\/\/|www\.)/i;
    const parts = text.split(splitRegex);
    return (
      <>
        {parts.map((part: string, index: number) => {
          if (urlStartRegex.test(part)) {
            // Clean URLs wrapped in parentheses or with trailing punctuation
            let display = part.trim();
            if (display.startsWith("(")) display = display.slice(1);
            display = display.replace(/\)+$/g, "");
            display = display.replace(/[\.,]+$/g, "");

            const href = display.startsWith("http")
              ? display
              : `https://${display}`;
            return (
              <a
                key={`link-${index}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {display}
              </a>
            );
          }
          return <span key={`text-${index}`}>{part}</span>;
        })}
      </>
    );
  };

  const streamBotResponse = async (fullText: string, options?: { showFaqOnComplete?: boolean }) => {
    // Hide FAQs while streaming
    setShowFAQ(false);
    const messageId = (Date.now() + 1).toString();
    const initial: Message = {
      id: messageId,
      text: "",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, initial]);

    // Stream characters progressively
    const chars = Array.from(fullText);
    let current = "";
    const chunkSize = 2; // render 2 chars per tick for smoother effect
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        current += chars.splice(0, chunkSize).join("");
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, text: current } : m))
        );
        if (chars.length === 0) {
          clearInterval(interval);
          if (options?.showFaqOnComplete !== false) {
            setShowFAQ(true);
          }
          resolve();
        }
      }, 18);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 bottom-2 sm:bottom-6 right-0 md:right-44 left-2 sm:left-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-[380px] sm:w-96 h-[70vh] sm:h-[520px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#CC75EF] to-[#8351E0] text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E9EAEB] flex items-center justify-center">
              <Image src="/botLogo.svg" alt="Chatbot" width={20} height={20} />
            </div>
            <span className="font-semibold">KARSAAZ BOT</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#8351E0] hover:bg-white hover:bg-opacity-20 cursor-pointer rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#F8F9FA]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex my-2 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-[#E9EAEB] flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/botLogo.svg"
                      alt="Chatbot"
                      width={16}
                      height={16}
                    />
                  </div>
                )}
                {message.sender === "user" && (
                  <div className="w-6 h-6 bg-blue-100 rounded-full  flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`px-3 py-2 ${
                    message.sender === "user"
                      ? "bg-[#B6B6BC1F] text-[#9062E5] rounded-2xl rounded-tr-none"
                      : "bg-[#A079EA40] text-black rounded-2xl rounded-tl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">
                    {renderMessageText(message.text)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Cloudflare Verification First */}
          {!token && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Human Verification
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please complete the verification to continue.
                </p>

                <Turnstile
                  turnstileSiteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY ?? ""}
                  callback={async (token) => {
                    // console.log("Turnstile token received:", token); // Add this line to check the token
                    const isValid = await cloudflareTrustHandler(token);
                    if (isValid) {
                      setToken(token);
                      // After success, show email form first (message will appear after email)
                      setShowEmailForm(true);
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Email Form */}
          {showEmailForm && !isEmailSubmitted && (
            // <div className="space-y-4 border border-black">
            //      <h3 className="font-semibold text-gray-800 mb-2">Get Started</h3>
            //     <p className="text-sm text-gray-600 mb-4">
            //       Please provide your email to start chatting with our AI assistant.
            //     </p>

            // </div>
            <div className={`flex justify-start`}>
              <div className={`flex items-start gap-2 max-w-[80%] `}>
                <div className="w-12 h-8 rounded-full bg-[#E9EAEB] flex items-center justify-center">
                  <Image
                    src="/botLogo.svg"
                    alt="Chatbot"
                    width={20}
                    height={20}
                  />
                </div>

                <div
                  className={`rounded-2xl rounded-tl-none px-3 py-2 
                     bg-[#A079EA40] text-black
                    `}
                >
                  <p className="text-sm whitespace-pre-line">Get Started</p>
                  <p className="text-xs text-black mt-1">
                    Please provide your email to start chatting with our AI
                    assistant.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Options */}
          {showFAQ && isEmailSubmitted && !escalation && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleFAQClick("What is Karsaaz QR and how does it work ??")}
                  className="p-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-left text-black cursor-pointer"
                >
                  What is Karsaaz QR and how does it work ??
                </button>
                <button
                  onClick={() => handleFAQClick("What makes Karsaaz QR different from other QR generators?")}
                  className="p-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-left text-black cursor-pointer"
                >
                  What makes Karsaaz QR different from other QR generators?
                </button>
                <button
                  onClick={() =>
                    handleFAQClick("Is Karsaaz QR secure and compliant for businesses?")
                  }
                  className="p-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-left text-black cursor-pointer"
                >
                  Is Karsaaz QR secure and compliant for businesses?
                </button>
                <button
                  onClick={() => handleFAQClick("What pricing plans and benefits does Karsaaz QR offer?")}
                  className="p-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-left text-black cursor-pointer"
                >
                  What pricing plans and benefits does Karsaaz QR offer?
                </button>
              </div>
            </div>
          )}

          {/* Escalation Prompt */}
          {escalation && (
            <div className="space-y-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    // On Yes: if logged in, go to support system; else go to login first
                    try {
                      const token =
                        typeof window !== "undefined"
                          ? document.cookie.match(
                              /(?:^|; )auth_token=([^;]+)/
                            )?.[1] || ""
                          : "";
                      if (token) {
                        router.push("/dashboard");
                      } else {
                        // Ask Home to open the AuthDrawer and prefill email; it will redirect after login
                        window.dispatchEvent(
                          new CustomEvent("open-auth", {
                            detail: { next: "/dashboard", prefillEmail: email },
                          })
                        );
                      }
                    } catch {}
                    setEscalation(null);
                  }}
                  className="p-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setEscalation(null);
                    setShowFAQ(false);
                    onClose();
                  }}
                  className="p-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start my-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E9EAEB] flex items-center justify-center">
                  <Image
                    src="/botLogo.svg"
                    alt="Chatbot"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="bg-[#A079EA40] rounded-2xl rounded-tl-none px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Bar - full width, fixed to card bottom */}
        {isEmailSubmitted ? (
          <div className="w-full p-4 border-t border-gray-200">
            <div className="w-full bg-[#F4F4F5] rounded-2xl px-4 py-3 flex items-center shadow-sm">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#8E60E4] text-[#8E60E4] hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send"
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : showEmailForm && !isEmailSubmitted ? (
          <div className="w-full p-4 border-t border-gray-200">
            <div className="w-full bg-[#F4F4F5] rounded-2xl px-4 py-3 flex items-center shadow-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-sm text-black"
                required
              />
              <button
                onClick={(e) => handleEmailSubmit(e)}
                disabled={!isValidEmail(email) || isLoading}
                className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#8E60E4] text-[#8E60E4] hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Submit email"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SendHorizonal className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

