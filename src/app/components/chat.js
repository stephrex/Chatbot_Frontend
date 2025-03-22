"use client";
import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import "../styles/Chat.css";
import ReactMarkdown from "react-markdown";
import { FaCommentDots, FaChartBar, FaSearch, FaCog, FaRocket } from "react-icons/fa";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
      if (!input.trim()) return;

      const userMessage = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);

      setInput("");
      setIsTyping(true);  // Show typing animation

      let userId = null;
      if (typeof window !== "undefined") {
        userId = localStorage.getItem("user_id");
        if (!userId) {
          userId = `user_${Math.random().toString(36).slice(2, 9)}`;
          localStorage.setItem("user_id", userId);
        }
      }

      try {
        const response = await fetch("./api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: input, user_id: userId }),
        });

        const data = await response.json();
        setIsTyping(false);  // Hide typing animation
        typeMessage(data.reply.response); // Start typing effect
      } catch (error) {
        console.error("Error:", error);
        setIsTyping(false);  // Hide typing if an error occurs
      }
    };

    const typeMessage = (fullText) => {
      let index = 0;
      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
      
      const interval = setInterval(() => {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText.slice(0, index + 1);
          return newMessages;
        });
        
        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
        }
      }, 10); // speed of typing
    };

    return (
      <div className="chat-wrapper">
        <div className="chat-container">
          <div className="chatbox">
            {messages.length === 0 && (
              <div className="chat-placeholder">
                <p className="placeholder-message"> <FaCommentDots className="placeholder-icon" /> Welcome to AI-Customer Support Assistant!</p>
                <p className="placeholder-message"> <FaChartBar className="placeholder-icon" /> 24/7 support boosts sales—customers want instant service.</p>
                <p className="placeholder-message"> <FaSearch className="placeholder-icon" /> Automate FAQs & save time for what truly matters.</p>
                <p className='placeholder-message'> <FaCog className="placeholder-icon" /> AI-powered support increases efficiency & customer satisfaction.</p>
                <p className="placeholder-message"> <FaRocket className="placeholder-icon" /> Reduce workload, improve response times, and scale seamlessly.</p>
                <p className='placeholder-message'> Stay ahead—transform customer support with AI today!</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`message-container ${msg.sender}`}>
                <span className="sender-name">
                  {msg.sender === "user" ? "You" : "ChatEase"}
                </span>
                <div className={`message ${msg.sender}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span>AI-Support is typing</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

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