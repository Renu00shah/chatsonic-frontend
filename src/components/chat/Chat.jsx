"use client";

import axiosInstance from "@/api/axios";
import { MyContext } from "@/context/AppContext";
import CustomTextfield from "@/custom/CustomTextfield";
import { Send } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Chat() {
  const { message, selectedChatId, fetchMessages } = useContext(MyContext);
  // console.log("newId:", newChat);
  const [content, setContent] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (selectedChatId) {
      inputRef.current?.focus();
    }
  }, [selectedChatId]);
  console.log(selectedChatId);
  console.log(message);

  const handleNewMessage = async () => {
    try {
      const res = await axiosInstance.post(
        `/message/create/${selectedChatId}`,
        { content }
      );
      console.log(res);
      if (res.data.success) {
        // toast.success(res.data.message);
        setContent("");
        fetchMessages();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.res.data.message || "something went wrong");
    }
  };
  return (
    <div className="h-screen flex flex-col justify-between p-4 gap-4">
      <div className="overflow-y-auto ">
        {message.length > 0 ? (
          message.map((item) => (
            <div key={item._id}>
              {item.role === "user" ? (
                <h1 className="text-medium text-right font-bold ">
                  {item.content}
                </h1>
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
