"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mockMessages = [
  { id: 1, text: "Hello, I'm having trouble updating my QR code URL. It says it's saved but still shows the old one.", sender: "user", time: "10:00 AM" },
  { id: 2, text: "Hi there! I'm sorry to hear that. Could you please provide the QR code ID you're trying to update?", sender: "support", time: "10:15 AM" },
  { id: 3, text: "The ID is #12345.", sender: "user", time: "10:20 AM" },
];

export default function TicketDetailsPage() {
  const params = useParams();
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link 
        href="/dashboard/support"
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to tickets
      </Link>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>QR code not updating</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Ticket #{params.id} • Status: Open</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {mockMessages.map((msg) => (
            <div 
              key={msg.id}
              className={cn(
                "flex items-start space-x-3",
                msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              )}>
                <User className="h-4 w-4" />
              </div>
              <div className={cn(
                "max-w-[80%] p-3 rounded-lg text-sm",
                msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"
              )}>
                {msg.text}
                <p className={cn(
                    "text-[10px] mt-1",
                    msg.sender === "user" ? "text-blue-200" : "text-gray-500"
                )}>
                    {msg.time}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t p-4">
          <form 
            className="flex w-full items-center space-x-2"
            onSubmit={(e) => { e.preventDefault(); setMessage(""); }}
          >
            <Input 
                placeholder="Type your message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
