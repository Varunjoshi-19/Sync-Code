"use client";

import { Code2, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseGlobalContext } from "../Context/GlobalContext";
import { useRouter } from "next/navigation";
import { useRoomStore } from "../Store/store";
import toast from "react-hot-toast";
import { useState } from "react";
import useRoom from "../hooks";

type MenuItem =
  | { title: string; link: string; callback?: never }
  | { title: string; callback: () => void; link?: never };

export default function Topbar({ options = true, upgrade = false }: { options: boolean, upgrade?: boolean }) {


  const { setShareDilog, setShowPricingPopup } = UseGlobalContext();
  const { loggedIn, user, setEditorText } = useRoomStore();
  const { handleCreateRoom } = useRoom();
  const [accountDetails, setAccountDetails] = useState<boolean>(false);
  const router = useRouter();

  const handleShare = () => {
    setShareDilog({
      open: true,
      url: window.location.href
    });
  }

  const handleLogout = () => {
      
  }

  const handleSaveCode = () => {
    if (!loggedIn) {
      toast.error("Login first before saving your code !!", { duration: 2000 });
      router.push("/login");
      return;
    }

    // TODO : save code logic

  }

  const AccountDetails = () => {
    const menu: MenuItem[] = [
      { title: "Your CodeSync", link: "/codes" },
      {
        title: "New CodeSync", callback: () => {
          setEditorText("");
          handleCreateRoom();

        }
      },
      { title: "Account Settings", link: "/settings" },
      { title: "Log Out", callback: handleLogout }
    ];

    const baseStyle = "cursor-pointer block w-full text-left px-4 py-3 text-blue-700 hover:bg-gray-100 rounded-lg";

    return (
      <div className="z-10 absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border">
        {menu.map((item, i) => {
          if ("link" in item) {
            return (
              <a key={i} href={item.link} className={baseStyle}>
                {item.title}
              </a>
            );
          }

          return (
            <button key={i} onClick={item.callback} className={baseStyle}>
              {item.title}
            </button>
          );
        })}
      </div>
    );
  };

  return (

    <div className="w-full flex items-center justify-between px-3 py-2 bg-[#30353E] border-b border-slate-800">
      <div onClick={() => router.push("/")} className="flex items-center gap-2 cursor-pointer">
        <Code2 className="w-4 h-4 text-emerald-400" />
        <span className="text-lg font-semibold text-white">Code-Sync</span>
      </div>

      <div className="flex items-center justify-center gap-2">

        {upgrade &&

          <button onClick={() => setShowPricingPopup(true)}
            className="bg-emerald-400 hover:bg-emerald-600
             text-white flex items-center gap-1  px-5 py-2 rounded-md text-sm font-medium transition">
            <Star size={18} fill={"#fff"} />
            Upgrade
          </button>
        }

        {options && (!loggedIn ?
          <div className="relative">
            <span
              onClick={() => setAccountDetails(prev => !prev)}
              style={{ border: `2px solid ${accountDetails ? "white" : "transparent"}` }}
              className={`text-white opacity-50 cursor-pointer px-2 py-2 
        hover:opacity-100 transition-opacity `}>
              {user?.fullName.toString().toUpperCase()}
            </span>
            {accountDetails && <AccountDetails />}
          </div>
          :
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveCode}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-4 cursor-pointer">
              Save CodeSync
            </Button>

            <Button onClick={handleShare} className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl px-4 cursor-pointer">
              <Users />
              Share
            </Button>

            <Button onClick={() => router.push("/login")} className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl px-4 cursor-pointer">
              Log In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
