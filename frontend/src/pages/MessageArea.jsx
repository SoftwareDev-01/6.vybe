import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { LuImage } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import axios from "axios";

import dp from "../assets/dp.webp";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import { serverUrl } from "../App";

import {
  setMessages,
  addMessage,
  deleteMessageForMe,
  deleteMessageForEveryone,
  setSelectedUser,
} from "../redux/messageSlice";

function MessageArea() {
  const { selectedUser, messages } = useSelector((s) => s.message);
  const { prevChatUsers } = useSelector((s) => s.message);
  const { userData } = useSelector((s) => s.user);
  const { socket } = useSelector((s) => s.socket);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const imageInput = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  /* ================= SAFETY ================= */

  // If user reloads on /messageArea, attempt to auto-select the first prev chat
  // so the chat UI loads instead of showing an empty state.
  useEffect(() => {
    if (!selectedUser && Array.isArray(prevChatUsers) && prevChatUsers.length) {
      dispatch(setSelectedUser(prevChatUsers[0]));
    }
  }, [selectedUser, prevChatUsers, dispatch]);

  if (!selectedUser) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-gray-400">
        Select a conversation
      </div>
    );
  }

  /* ================= IMAGE ================= */

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(addMessage(res.data));
      socket?.emit("stopTyping", { to: selectedUser._id });

      setInput("");
      setBackendImage(null);
      setFrontendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= FETCH MESSAGES ================= */

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/message/getAll/${selectedUser._id}`,
          { withCredentials: true }
        );
        dispatch(setMessages(res.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (msg) => {
      dispatch(addMessage(msg));

      if (msg.sender !== userData._id) {
        socket.emit("messageSeen", {
          messageId: msg._id,
          to: msg.sender,
        });
      }
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));

    socket.on("messageSeen", ({ messageId }) => {
      dispatch(
        setMessages(
          messages.map((m) =>
            m._id === messageId ? { ...m, status: "seen" } : m
          )
        )
      );
    });

    socket.on("messageDeletedForEveryone", ({ messageId }) => {
      dispatch(deleteMessageForEveryone(messageId));
    });

    return () => {
      socket.off("newMessage");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageSeen");
      socket.off("messageDeletedForEveryone");
    };
  }, [socket, dispatch, userData, messages]);

  /* ================= TYPING HANDLER ================= */

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket?.emit("typing", { to: selectedUser._id });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket?.emit("stopTyping", { to: selectedUser._id });
    }, 900);
  };

  /* ================= DELETE MESSAGE ================= */

  const handleDeleteMessage = async (messageId, type) => {
    try {
      await axios.post(
        `${serverUrl}/api/message/delete`,
        { messageId, type },
        { withCredentials: true }
      );

      if (type === "me") {
        dispatch(deleteMessageForMe(messageId));
      }

      if (type === "everyone") {
        dispatch(deleteMessageForEveryone(messageId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ================= UI ================= */

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="h-[64px] flex items-center gap-4 px-4 border-b border-gray-800">
        <MdOutlineKeyboardBackspace
          className="text-white w-6 h-6 cursor-pointer"
          onClick={() => navigate(-1)}
        />

        <div
          className="w-9 h-9 rounded-full overflow-hidden cursor-pointer"
          onClick={() => navigate(`/profile/${selectedUser.userName}`)}
        >
          <img
            src={selectedUser.profileImage || dp}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-white leading-tight">
          <p className="font-semibold text-sm">
            {selectedUser.userName}
          </p>
          <p className="text-xs text-gray-400">
            {isTyping ? "Typing..." : selectedUser.name}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) =>
          msg.sender === userData._id ? (
            <SenderMessage
              key={msg._id}
              message={msg}
              onDelete={handleDeleteMessage}
            />
          ) : (
            <ReceiverMessage
              key={msg._id}
              message={msg}
              onDelete={handleDeleteMessage}
            />
          )
        )}

        {isTyping && (
          <p className="text-xs text-gray-400">
            {selectedUser.userName} is typing…
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="h-[64px] border-t border-gray-800 flex items-center px-4 gap-3"
      >
        <input
          type="file"
          hidden
          ref={imageInput}
          accept="image/*"
          onChange={handleImage}
        />

        <button
          type="button"
          onClick={() => imageInput.current.click()}
        >
          <LuImage className="w-6 h-6 text-white" />
        </button>

        <input
          type="text"
          placeholder="Message…"
          value={input}
          onChange={handleTyping}
          className="flex-1 bg-transparent text-white text-sm outline-none"
        />

        {(input || frontendImage) && (
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#2563eb] flex items-center justify-center"
          >
            <IoMdSend className="text-white w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
}

export default MessageArea;
