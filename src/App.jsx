import github from "./assets/github_logo.svg";
import send from "./assets/send.svg";
import { useState, useRef, useEffect } from "react";



export default function App() {
  const [chat, setChat] = useState([
    {
      sender: "Server",
      text: "I am a ChatGPT Clone, built by Prakhar Srivastava. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = async () => {
    if (input.trim() === "" || loading) return;

    const userMessage = { sender: "User", text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`https://api.cohere.ai/v1/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer A2zxN5JCkfUgU4akmYmwvBuc9B92pufU0UmSijHG`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "command",
          prompt: input,
          max_tokens: 1000,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: "NONE",
        }),
      });

      const data = await response.json();
      const replyText =
        data.generations?.[0]?.text?.trim() || "No response from server.";

      const serverMessage = { sender: "Server", text: replyText };
      setChat((prev) => [...prev, serverMessage]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "Server", text: "⚠️ Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black w-screen h-screen flex items-center justify-center">
      <div className="bg-[#212121] w-full max-w-md h-full flex flex-col shadow-xl rounded-md overflow-hidden">
        {/* Header */}
        <div className="text-white font-semibold text-center p-1">
          <h4 className="border-2 rounded-sm inline-block px-2">
            Made by Prakhar Srivastava
          </h4>
        </div>

        {/* Navbar */}
        <div className="w-full h-12 flex items-center px-4 gap-2 justify-center">
          <img src={github} alt="GitHub" className="h-6 w-6 filter invert" />
          <span className="text-white font-semibold">ChatGPT</span>
        </div>

        {/* Chat Section */}
        {/* Chat Section */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "User" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-md text-white ${
                  msg.sender === "User"
                    ? "bg-green-600 rounded-br-none"
                    : "bg-[#40414f] rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading spinner as fake Server message */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#40414f] rounded-bl-none px-4 py-2 rounded-md text-white flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Section */}
        <div className="w-full flex items-center bg-[#212121] px-4 py-3 gap-3">
          <input
            type="text"
            placeholder={loading ? "Waiting for response..." : "Ask ChatGPT"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full bg-[#40414f] text-white placeholder:text-gray-400 rounded-md px-4 py-2 outline-none disabled:opacity-60"
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading}>
            <img
              src={send}
              alt="Send"
              className={`h-5 w-5 filter cursor-pointer ${
                loading ? "opacity-50" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
