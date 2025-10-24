"use client";

import axiosInstance from "@/api/axios";
import { MyContext } from "@/context/AppContext";
import CustomTextfield from "@/custom/CustomTextfield";
import {
  ClosedCaptionIcon,
  CrossIcon,
  DeleteIcon,
  Send,
  SendIcon,
} from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { SpinnerCustom } from "../spinner/Spinner";
import Dialog from "../dialog/Dialog";

export default function Chat() {
  const {
    message,
    selectedChatId,
    setSelectedChatId,
    fetchMessages,
    setMessage,
    open,
    setOpen,
    fetchLoginUserChats,
    chat,
    setChat,
  } = useContext(MyContext);
  console.log("new:", chat);
  // console.log("newId:", newChat);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const inputRef = useRef(null);
  useEffect(() => {
    if (selectedChatId) {
      inputRef.current?.focus();
    }
  }, [selectedChatId]);
  console.log(selectedChatId);
  console.log(message);

  const handleNewMessage = async () => {
    const tempMessagePayload = { _id: Date.now(), content, role: "user" };
    setMessage((prev) => [...prev, tempMessagePayload]);
    setContent("");
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/message/create/${selectedChatId}`,
        { content }
      );
      console.log(res);
      if (res.data.success) {
        // toast.success(res.data.message);
        // setContent("");
        fetchMessages();
        setLoading(false);
        // setMessage();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.res.data.message || "something went wrong");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchLoginUserChats(search);
    setSearch();
  };

  const handleRedirect = (id) => {
    setSelectedChatId(id);
  };
  return (
    <div className="h-screen flex flex-col justify-between p-4 gap-4">
      {open && (
        <>
          <Dialog isOpen={open} onClose={() => setOpen(false)}>
            <form
              className="h-6 flex items-center justify-center p-4 mt-5 gap-2 "
              onSubmit={handleSearch}
            >
              <CustomTextfield
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats..."
                type="text"
              />
              <DeleteIcon onClick={() => setOpen(false)} />
            </form>

            <div className="flex flex-col p-4">
              {chat.map((item) => (
                <div onClick={() => handleRedirect(item._id)} key={item._id}>
                  <h1 className="cursor-pointer">{item.title}</h1>
                </div>
              ))}
            </div>
          </Dialog>
        </>
      )}
      <div className="overflow-y-auto ">
        {message.length > 0 ? (
          message.map((item) => (
            <div key={item._id}>
              {item.role === "user" ? (
                <>
                  <h1 className="text-medium text-right font-bold ">
                    {item.content}
                  </h1>
                </>
              ) : (
                <h1 className="text-sm">{item.content}</h1>
              )}
            </div>
          ))
        ) : (
          <h1 className="text-3xl  font-bold  text-center text-gray-500">
            How can i help you?
          </h1>
        )}
      </div>
      {loading && (
        <div>
          <SpinnerCustom />
        </div>
      )}

      <div className="sticky flex justify-between gap-6 items-center">
        <CustomTextfield
          placeholder="Enter..."
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          ref={inputRef}
        />
        <Send onClick={handleNewMessage} />
      </div>
    </div>
  );
}
