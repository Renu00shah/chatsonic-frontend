import React, { useContext, useEffect, useState } from "react";
import { ModeToggle } from "../theme/Toggle";
import CustomButton from "@/custom/CustomButton";
import { Delete, Edit, Library, PencilIcon, Search } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/AppContext";
import axiosInstance from "@/api/axios";
import Dialog from "../dialog/Dialog";
import CustomTextfield from "@/custom/CustomTextfield";

export default function Sidebar() {
  const {
    chat,
    fetchLoginUserChats,
    message,
    setMessage,
    fetchMessages,
    selectedChatId,
    setSelectedChatId,
    token,
    open,
    setOpen,
  } = useContext(MyContext);

  console.log(chat);
  console.log(message);
  console.log(selectedChatId);

  console.log(chat);
  const router = useRouter();
  const handleLogout = () => {
    router.push("/register");
  };

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
      router.push(`?chatId=${selectedChatId}`);
    }
  }, [selectedChatId]);

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
  };

  const handleChatDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/chat/remove/${id}`);
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchLoginUserChats();
        // fetchMessages();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error.res.data.message || "something wrong");
    }
  };

  const handleNewChat = async () => {
    // setMessage("");
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
        const newChat = res.data.chat;
        setSelectedChatId(newChat._id);
        setMessage([]);
        // toast.success(res.data.message);
        fetchLoginUserChats();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.res.data.message || "something went wrong");
    }
  };

  // const handleEditchat = async (id) => {
  //   try {
  //     const res = await axiosInstance.put(`/chat/update/${id}`);
  //     console.log(res);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.res.data.message || "something wrong");
  //   }
  // };
  return (
    <div className="h-screen flex flex-col justify-between p-4 ">
      <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
        <div onClick={() => router.push("/dashboard")}>
          <h1 className="font-semibold text-lg cursor-pointer">ChatGPT</h1>
        </div>
        {/* <ModeToggle /> */}

        <div className="flex items-center gap-2 cursor-pointer">
          <PencilIcon size={15} />
          <button className="cursor-pointer" onClick={handleNewChat}>
            New chat
          </button>
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <Search size={15} />
          <button onClick={() => setOpen(true)}>Search chats</button>
        </div>
        <div className="flex items-center gap-2">
          <Library size={15} />
          <button>Library</button>
        </div>
        <h1 className="text-gray-500 font-sm overflow-y-auto">Chats</h1>
        {chat.map((item) => (
          <div key={item._id} className="flex items-center justify-between ">
            <button
              onClick={() => handleSelectChat(item._id)}
              className="cursor-pointer"
            >
              {item.title}
            </button>
            <div className="flex gap-1">
              {/* <Edit
                onClick={() => handleEditchat(item._id)}
                className="cursor-pointer"
                size={15}
              /> */}
              <Delete
                onClick={() => handleChatDelete(item._id)}
                className="cursor-pointer"
                size={15}
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <button onClick={handleLogout} className="cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
}
