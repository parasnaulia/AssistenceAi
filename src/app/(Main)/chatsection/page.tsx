"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { URL } from "@/app/constants/constants";
import { addUser } from "@/Store/UserStore";
import { credFetcher } from "@/utlis/credFetcher";

const ChatSection = () => {
  const dispatch = useDispatch();
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [instructions, setInstructions] = useState("");

  const [loader, setLoader] = useState(false);

  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (!user.id) return;

    const fetchAssistants = async () => {
      try {
        const response = await fetch(`${URL}/${user.id}`);
        const data = await response.json();
        if (data?.success) setAssistants(data?.data);
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    };

    fetchAssistants();
  }, [user]);

  useEffect(() => {
    const fetchUserCredentials = async () => {
      const userData = await credFetcher();
      dispatch(addUser(userData));
    };

    fetchUserCredentials();
  }, [dispatch]);

  const handleSelectAssistant = (assistant) => {
    setSelectedAssistant(assistant);
    setInstructions(assistant?.description || "");
    setMessages([]);
  };

  const handleSaveInstructions = async () => {
    try {
      const response = await fetch(`${URL}/updateins`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected: selectedAssistant,
          disc: instructions,
        }),
        cache: "no-store", // Prevents Next.js from caching the response
        next: { revalidate: 0 },
      });
      const data = await response.json();
      alert(
        data?.success
          ? "Instructions saved successfully"
          : "Failed to save instructions"
      );
    } catch (error) {
      console.error("Error saving instructions:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    try {
      setLoader(true);
      const genAI = new GoogleGenerativeAI(
        "AIzaSyC3WaJ9Iz5YqegTiqf9UC1fGwUmtpeujIc"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `${selectedAssistant?.description} ${chatInput}`;
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();

      setMessages((prev) => [
        ...prev,
        { id: 2, text: chatInput },
        { id: 1, text: responseText },
      ]);
      setChatInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="grid grid-cols-5 h-screen">
      <aside className="col-span-1 border-r p-4">
        <h2 className="text-2xl font-bold text-center mb-4">AI Assistants</h2>
        <button className="bg-blue-500 text-white p-2 w-full mb-4">
          Add Assistant
        </button>
        <div className="flex flex-col gap-4">
          {assistants.map((assistant, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectAssistant(assistant)}
            >
              <Image
                src={assistant.src}
                alt={assistant.aName}
                width={50}
                height={50}
              />
              <span>{assistant.aName}</span>
            </div>
          ))}
        </div>
      </aside>
      <main className="col-span-3 flex flex-col p-6 border-r">
        <h1 className="text-3xl font-bold mb-4 text-center">Chat</h1>
        <div className="flex-1 overflow-y-auto p-4 border rounded">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mt-2 ${msg.id === 1 ? "text-left" : "text-right"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type here..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-500 text-white p-2 rounded"
          >
            {loader ? "Loading..." : "Send"}
          </button>
        </div>
      </main>
      <aside className="col-span-1 p-6">
        {selectedAssistant && (
          <div className="flex flex-col items-center gap-4">
            <Image
              src={selectedAssistant.src}
              alt={selectedAssistant.aName}
              width={150}
              height={150}
            />
            <h2 className="text-xl font-bold">{selectedAssistant.aName}</h2>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2 border rounded"
              rows={6}
            />
            <div className="flex gap-4">
              <button className="bg-gray-400 text-white p-2 rounded">
                Cancel
              </button>
              <button
                onClick={handleSaveInstructions}
                className="bg-blue-600 text-white p-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ChatSection;
