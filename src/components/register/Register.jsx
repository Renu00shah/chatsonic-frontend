"use client";
import React, { useContext, useEffect, useState } from "react";
import CustomTextfield from "@/custom/CustomTextfield";
import CustomButton from "@/custom/CustomButton";
import { MyContext } from "@/context/AppContext";

export default function Register() {
  const { register, login, form, setForm, currentState, setCurrentState } =
    useContext(MyContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentState === "Register") {
      register();
    } else {
      login();
    }
  };

  const handleStateChange = () => {
    setCurrentState((prev) => (prev === "Register" ? "Login" : "Register"));
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className=" h-screen flex flex-col items-center justify-center text-center">
        <div className="shadow-2xl p-4 rounded-2xl flex flex-col gap-3">
          <h1 className="font-bold text-2xl ">{currentState}</h1>
          {currentState === "Register" && (
            <CustomTextfield
              type="text"
              placeholder="Enter Name"
              name="name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
          )}

          <CustomTextfield
            type="email"
            placeholder="Enter Email"
            name="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
          <CustomTextfield
            type="password"
            placeholder="Enter Password"
            name="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
          <CustomButton type="submit" text={currentState} />
          <p className=" text-sm font-medium">
            {currentState === "Register"
              ? "Already have an account? Please "
              : "Do not have an account? Please "}
            <a
              onClick={handleStateChange}
              className="font-semibold cursor-pointer text-blue-700 text-medium "
            >
              {currentState === "Register" ? "Login" : "Register"}
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}
