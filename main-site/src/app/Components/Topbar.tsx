"use client";

import { Code2, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useRoomStore } from "../Store/store";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useGlobalStore } from "../Store";
import AccountDetails from "../Modules/AccountDetails";
import Login from "../(auth)/components/Login";



export default function Topbar({ options = true, upgrade = false }: { options: boolean, upgrade?: boolean }) {


  const { loggedIn, user } = useRoomStore();
  const { setShareDilog, setShowPricingPopup } = useGlobalStore();
  const [accountDetails, setAccountDetails] = useState<boolean>(false);
  const [loginBox, setLoginBox] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();

  const handleShare = () => {
    setShareDilog({
      open: true,
      url: window.location.href
    });
  }

  const handleSaveCode = () => {
    if (!loggedIn) {
      toast.error("Login first before saving your code !!", { duration: 2000 });
      setLoginBox(prev => !prev);
      return;
    }

    // TODO : save code logic

  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
      <>
      {loginBox && <Login dilogBox={true} setClose={setLoginBox} />}
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

        <Button
          onClick={handleSaveCode}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-4 cursor-pointer">
          Save CodeSync
        </Button>

        <Button onClick={handleShare} className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl px-4 cursor-pointer">
          <Users />
          Share
        </Button>

        {options && (loggedIn ?
          <div className="relative">
            <span
              onClick={() => setAccountDetails(prev => !prev)}
              style={{ border: `2px solid ${accountDetails ? "white" : "transparent"}` }}
              className={`text-white opacity-50 cursor-pointer px-2 py-2 
        hover:opacity-100 transition-opacity `}>
              {user?.fullName?.toString().toUpperCase()}
            </span>
            {accountDetails && <AccountDetails />}
          </div>
          :
          <div className="flex items-center gap-3">

            <Button onClick={() => router.push("/login")} className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl px-4 cursor-pointer">
              Log In
            </Button>
          </div>
        )}
      </div>
    </div>
      </>

  );
}
