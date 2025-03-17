"use client";
import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import "../styles/Chat.css";
import ReactMarkdown from "react-markdown";


export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);
  
    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    const sendMessage = async () => {
      if (!input.trim()) return;
  
      const userMessage = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);

      // Check if user ID exists in localStorage
      let userId = null;
      if (typeof window !== "undefined") {
        userId = localStorage.getItem("user_id");
        if (!userId) {
          userId = `user_${Math.random().toString(36).slice(2, 9)}`; // Generate a random user ID
          localStorage.setItem("user_id", userId); // Store in localStorage
        }
      }
      console.log(userId)

      try {
        const response = await fetch("./api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: input, user_id: userId}),
        });
  
        const data = await response.json();
        console.log(data.reply.response)
        const botMessage = { sender: "bot", text: data.reply.response };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error:", error);
      }
  
      setInput("");
    };
  
    return (
      <div className="chat-wrapper">
        <div className="chat-container">
          {/* Chatbox */}
          <div className="chatbox">
            {messages.length === 0 && (
              <div className="chat-placeholder">
                <p className="placeholder-message">✨ Welcome to ChatEase!</p>
                <p className="placeholder-message">🤖 Your AI-powered customer support assistant is here!</p>
                {/* <p className="placeholder-message">Do you know </p> */}
                <p className="placeholder-message">🚀 Ask me anything concerning!</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`message-container ${msg.sender}`}>
                {/* Sender Name */}
                <span className="sender-name">
                  {msg.sender === "user" ? "You" : "ChatEase"}
                </span>
                {/* Message */}
                <div className={`message ${msg.sender}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="send-btn">
              <IoSend className="send-icon" />
            </button>
          </div>
        </div>
      </div>
    );    
  }
  