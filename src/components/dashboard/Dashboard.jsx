"use client";
import axiosInstance from "@/api/axios";
import { MyContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Dashboard() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [chatId, setChatId] = useState();
  const [message, setMessage] = useState([]);
  const { user, token, chat } = useContext(MyContext);
  console.log(user);
  console.log(token);
  console.log(chat);
  console.log(chatId);

  const handleLogout = () => {
    router.push("/register");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/message/create/${chatId}`, {
        content,
      });
      console.log(res);
      if (res.data.success) {
        // toast.success(res.data.message);
        setContent("");
        fetchMessages();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error.res.data.message || "something wrong");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/message/get/${chatId}`);
      console.log(res);
      if (res.data.success) {
        // toast.success(res.data.message);
        setMessage(res.data.messages);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.res.data.message || "something wrong");
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const handleNewChat = async () => {
    try {
      const res = await axiosInstance.post(
        "/chat/create",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res);
      if (res.data.success) {
        // toast.success(res.data.message);
        const newChat = res.data.chat;
        setChatId(newChat._id);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.res.data.message || "something went wrong");
    }
  };

  return (
    <div>
      <button className="cursor-pointer" onClick={handleNewChat}>
        New Chat
      </button>
      <h1>Chats</h1>

      {chat.map((item) => {
        return (
          <button
            onClick={() => setChatId(item._id)}
            className="cursor-pointer"
            key={item._id}
          >
            {item.title}
          </button>
        );
      })}

      <h1>Messages</h1>
      {message.map((item) => (
        <h1 key={item._id}>{item.content}</h1>
      ))}

      <form onSubmit={handleSumbit}>
        <input
          name="content"
          value={content}
          type="text"
          placeholder="Enter"
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}
