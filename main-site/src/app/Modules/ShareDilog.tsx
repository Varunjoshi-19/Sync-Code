"use client";

import React, { useState } from "react";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { UseGlobalContext } from "../Context/GlobalContext";


const ShareDialog: React.FC = () => {
    const [viewOnly, setViewOnly] = useState(false);
    const { shareDilog, setShareDilog } = UseGlobalContext();

    const copyToClipboard = () => {
        if (!shareDilog) return;
        navigator.clipboard.writeText(shareDilog.url);
        toast.success("URL copied sucessfully !");
    };

    if (!shareDilog) return null;

    return (
        <div className="z-20 fixed inset-0 bg-[#1c1c1cb3]  flex items-center justify-center">
            <div className="bg-white w-130 rounded-xl p-8 shadow-xl relative">

                <button
                    onClick={() => setShareDilog(null)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-light text-blue-900">Share Code</h2>

                <p className="mt-4 text-gray-700">
                    Anyone with access to this URL will see your code in real time.
                </p>

                <div className="mt-6">
                    <p className="text-sm text-gray-400 mb-1">Share this URL</p>

                    <div className="flex items-center gap-2">
                        <input
                            className="flex-1 border rounded px-3 py-2 text-gray-700 outline-none"
                            value={shareDilog.url}
                            readOnly
                        />

                        <button
                            onClick={copyToClipboard}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <Copy />
                        </button>
                    </div>
                </div>



                <div className="mt-6">
                    <p className="text-gray-500 mb-2">View only mode</p>

                    <div className="group relative inline-block">
                       
                        <div onClick={() => setViewOnly(!viewOnly)}
                            className={`w-14 h-7 rounded-full p-1 cursor-pointer 
                            transition ${viewOnly ? "bg-green-500" : "bg-gray-300"}`}>
                            
                            <div className={`w-5 h-5 bg-white rounded-full shadow 
                            transform transition ${viewOnly ? "translate-x-7" : ""}`} />

                        </div>

                        <div className="absolute left-0 -top-9 hidden group-hover:block whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded">
                            Sorry only, registered user can manage this permission
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm mt-2">
                        Turn on view only mode if you dont want others to edit the code
                    </p>
                </div>


                <button
                    onClick={() => setShareDilog(null)}
                    className="mt-8 bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ShareDialog;
