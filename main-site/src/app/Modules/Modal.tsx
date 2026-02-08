"use client";

import { useEffect, useRef, useState } from "react";
import { ModalTypes } from "../Interfaces";
import { useRoomStore } from "../Store/store";

export default function Modal({ modalInfo, closeModal }: ModalTypes) {
  const { type, isOpen, title, description, btnType, holder, callbackFun } = modalInfo;

  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const { roomError, setRoomError } = useRoomStore();
  const inputRef = useRef<HTMLInputElement>(null);


  const validateInput = () => {
    if (!value.trim()) {
      if (title.toLowerCase().includes("join")) {
        return "Please enter a room ID";
      }
      return "Please enter your name";
    }
    return "";
  };

  const handleSubmit = () => {
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    callbackFun(value.trim());
    if (type == "CREATE") closeModal(null);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  useEffect(() => {

    if (isOpen) {
      setValue("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }

  }, [isOpen]);

  useEffect(() => {

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);

  }, [closeModal]);

  useEffect(() => {
    if (roomError) setError(roomError);
  }, [roomError]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => closeModal(null)}
      />

      <div className="relative bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-8 animate-scaleIn">
        <h2 className="text-xl font-semibold text-center text-black">
          {title}
        </h2>

        {description && (
          <p className="text-gray-500 text-center mt-2 mb-6">
            {description}
          </p>
        )}

        <input
          ref={inputRef}
          type="text"
          placeholder={holder}
          value={value}
          onKeyDown={handleEnter}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) {
              setError("");
              setRoomError(null);
            }
          }}
          className="w-full text-black border rounded-xl px-4 py-3 
                     focus:outline-none focus:ring-2 focus:ring-black"
        />

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl 
                     hover:opacity-90 transition disabled:opacity-40 cursor-pointer"
        >
          {btnType}
        </button>
      </div>

      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.18s ease-out;
        }
      `}</style>
    </div>
  );
}
