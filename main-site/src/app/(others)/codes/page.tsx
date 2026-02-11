"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ApiEndPoints } from "@/app/Config/endPoints";
import { useRoomStore } from "@/app/Store/store";
import { useEffect, useState } from "react";
import { ConfigSettingsType } from "@/app/Interfaces";
import { helper } from "@/app/Utils";
import Loader from "@/app/Components/Loader";
import { useNow } from "@/app/hooks/now";
import useRoom from "@/app/hooks";

interface Code {
  roomId: string;
  title: string;
  configSettings: ConfigSettingsType;
  createdAt: string;
  updatedAt: string;
};


export default function Codes() {

  const { user, setEditorText } = useRoomStore();
  const { handleCreateRoom } = useRoom();
  const [fetching, setFetching] = useState<boolean>(true);
  const [allRooms, setAllRooms] = useState<Code[]>([]);

  const handleFetchRooms = async () => {
    try {
      if (!user?.id) return;
      setFetching(true);
      const res = await fetch(`${ApiEndPoints.allRooms}/${user.id}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      console.log("Rooms:", data.rooms);

      if (res.ok) {
        setAllRooms(data.rooms);
      }
    } catch (error) {
      console.error("Fetch rooms failed:", error);
    }
    finally {
      setFetching(false);
    }
  };

  function CodeRow({ code }: { code: Code }) {
    const now = useNow(1000);

    if (!now) {
      return <time>—</time>;
    }

    return (
      <time>
        {helper.formatRelativeTime(code.updatedAt, now)}
      </time>
    );
  }

  const createRoom = () => {
    setEditorText("");
    handleCreateRoom();

  }

  useEffect(() => {
    if (!user?.id) {
      return;
    };
    handleFetchRooms();
  }, [user?.id]);



  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-light text-gray-900">Your CodeSync</h1>

        <button
          onClick={createRoom}
          className="bg-emerald-400 cursor-pointer
           hover:bg-emerald-600 text-white px-5 
           py-2 rounded-md text-sm font-medium transition"
        
        >
          New CodeSync
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-gray-700">
            <tr className="border-b">
              <th className="text-left px-6 py-4 font-semibold">URL</th>
              <th className="text-left px-6 py-4 font-semibold">TITLE</th>
              <th className="text-left px-6 py-4 font-semibold">SYNTAX</th>
              <th className="text-left px-6 py-4 font-semibold">MODIFIED</th>
              <th className="text-left px-6 py-4 font-semibold">CREATED</th>
              <th className="text-left px-6 py-4 font-semibold">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {allRooms.length === 0 ? (
              <tr>
                {
                  fetching ?
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      <Loader size={25} />
                    </td>
                    :

                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      No rooms found
                    </td>

                }
              </tr>
            ) : (
              allRooms.map((code) => (
                <tr
                  key={code.roomId}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/room/${code.roomId}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      /{code.roomId}
                    </Link>
                  </td>

                  <td className="px-6 py-4 text-blue-600 font-medium">
                    {code.title}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {code.configSettings.languageType.id}
                  </td>

                  <td className="px-6 py-4 text-gray-700" >
                    <CodeRow code={code} />
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {helper.formatRelativeTime(code.createdAt, Date.now())}
                  </td>

                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
