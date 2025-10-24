import React, { useState } from "react";

export default function Dialog({ isOpen, onClose, children }) {
  return (
    <div className="fixed inset-0   flex justify-center items-center z-50">
      <div className="bg-gray-500 rounded-lg p-4 w-[500px] max-w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
