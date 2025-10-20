"use client";
import axiosInstance from "@/api/axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
export const MyContext = createContext();

const ProviderWrapper = ({ children }) => {
  const [chat, setChat] = useState([]);
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [chatId, setChatId] = useState();
  const router = useRouter();
  const [currentState, setCurrentState] = useState("Register");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const register = async () => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        setCurrentState("Login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.res.data.message || "Something went wrong");
    }
  };

  const login = async () => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        router.push("/dashboard");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.res.data.message || "something went wrong");
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedToken && savedUser) {
      setUser(savedUser);
      setToken(savedToken);
    }
  }, []);

  const fetchLoginUserChats = async () => {
    try {
      const res = await axiosInstance.get("/chat/single", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      if (res.data.success) {
        setChat(res.data.chat);

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.res.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchLoginUserChats();
    }
  }, [user]);

  const value = {
    register,
    login,
    form,
    setForm,
    currentState,
    setCurrentState,
    user,
    setUser,
    token,
    setToken,
    chatId,
    chat,
    setChat,
  };
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
export default ProviderWrapper;
