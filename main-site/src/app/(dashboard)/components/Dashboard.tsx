"use client";

import { UseGlobalContext } from "@/app/Context/GlobalContext";
import useRoom from "@/app/hooks";
import { ModalInfo, OptionType } from "@/app/Interfaces";
import Modal from "@/app/Modules/Modal";
import { useRoomStore } from "@/app/Store/store";
import { useRouter } from "next/navigation";
import { useState , useEffect } from "react";
import toast from "react-hot-toast";



const Dashboard = () => {

  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null);
  const { user } = useRoomStore();
  const { socket } = UseGlobalContext();
  const { handleCreateRoom } = useRoom();
  const router = useRouter();


  const handleJoinRoom = (roomId: string) => {
    if (!socket || !user) {
      alert(`${user} ${socket.id}`)
      toast.error("Failed to Join socket Id or User Id missing !!");
      return;
    }

    socket.emit("check-room-existance", {
      userId: user.id,
      roomId,
      socketId: socket.id,
    });
  }

  const modalTemplates: Record<OptionType, ModalInfo> = {
    CREATE: {
      type: "CREATE",
      isOpen: true,
      title: "Create a new room",
      description:
        "Enter your name to start a room and invite others to collaborate.",
      btnType: "Create Room",
      holder: "Your name",
      callbackFun: handleCreateRoom,
    },

    JOIN: {
      type: "JOIN",
      isOpen: true,
      title: "Join an existing room",
      description:
        "Enter the room ID shared with you to join the session.",
      btnType: "Join Room",
      holder: "Room ID",
      callbackFun: handleJoinRoom,
    },
  };


  const chooseOption = (type: OptionType) => {
    setModalInfo(modalTemplates[type]);
  }


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "j") {
        chooseOption("JOIN");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [chooseOption]);



  return (
    <>
      {modalInfo && <Modal modalInfo={modalInfo} closeModal={setModalInfo} />}
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] overflow-hidden">
        <div
          className="fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
            linear-gradient(#58a6ff 1px, transparent 1px),
            linear-gradient(90deg, #58a6ff 1px, transparent 1px)
          `,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[60%] bg-[#238636] rounded-full blur-[120px] opacity-20" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[50%] bg-[#1f6feb] rounded-full blur-[120px] opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
          <header className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#238636] to-[#1f6feb] flex items-center justify-center font-mono text-sm font-bold">
                &lt;/&gt;
              </div>
              <span className="font-mono font-semibold text-lg tracking-tight">
                CodeSync
              </span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-[#8b949e]">
              <a href="/pricing" className="hover:text-[#e6edf3] transition-colors">
                Pricing
              </a>
              <a href="/register" className="hover:text-[#e6edf3] transition-colors">
                Sign Up
              </a>
              <button onClick={() => router.push("/login")} className="cursor-pointer px-4 py-2 rounded-lg bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] hover:bg-[#30363d] transition-colors">
                Log In
              </button>
            </nav>
          </header>

          <section className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-r from-[#e6edf3] via-[#58a6ff] to-[#3fb950]">
              Code together in real time
            </h1>
            <p className="text-xl text-[#8b949e] max-w-2xl mx-auto mb-12">
              Share your editor instantly. No signup required. Create a room, send
              the link, and start coding with your team.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button onClick={() => chooseOption("CREATE")} className="group flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-[#238636] hover:bg-[#2ea043] border border-[#238636] hover:border-[#2ea043] transition-all duration-200 shadow-lg shadow-[#238636]/20 hover:shadow-[#238636]/30 hover:scale-[1.02]">
                <span className="font-mono text-lg font-semibold">
                  Create new room
                </span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button onClick={() => chooseOption("JOIN")} className="flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-[#58a6ff] hover:bg-[#161b22] transition-all duration-200 hover:scale-[1.02]">
                <span className="font-mono text-lg font-semibold text-[#e6edf3]">
                  Join with code
                </span>
                <kbd className="px-2 py-1 rounded bg-[#0d1117] border border-[#30363d] font-mono text-sm text-[#8b949e]">
                  Ctrl + J
                </kbd>
              </button>
            </div>
          </section>

          {/* Code preview panel */}
          <section className="rounded-2xl border border-[#30363d] bg-[#161b22]/80 backdrop-blur overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#30363d] bg-[#0d1117]/50">
              <div className="w-3 h-3 rounded-full bg-[#ff7b72]" />
              <div className="w-3 h-3 rounded-full bg-[#f2cc60]" />
              <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
              <span className="ml-4 text-sm text-[#8b949e] font-mono">
                app.tsx — Live
              </span>
            </div>
            <div className="p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-[#e6edf3]">
                <code>
                  <span className="text-[#7ee787]">const</span>{" "}
                  <span className="text-[#d2a8ff]">room</span>{" "}
                  <span className="text-[#e6edf3]">=</span>{" "}
                  <span className="text-[#79c0ff]">useRoom</span>
                  <span className="text-[#e6edf3]">(</span>
                  <span className="text-[#a5d6ff]">&quot;abc-xyz-123&quot;</span>
                  <span className="text-[#e6edf3]">);</span>
                  {"\n"}
                  <span className="text-[#7ee787]">const</span>{" "}
                  <span className="text-[#d2a8ff]">cursor</span>{" "}
                  <span className="text-[#e6edf3]">=</span>{" "}
                  <span className="text-[#79c0ff]">useOthers</span>
                  <span className="text-[#e6edf3]">();</span>
                  {"\n\n"}
                  <span className="text-[#8b949e]">// Share the link — everyone sees the same code</span>
                  {"\n"}
                  <span className="text-[#7ee787]">return</span>{" "}
                  <span className="text-[#e6edf3]">&lt;</span>
                  <span className="text-[#7ee787]">LiveEditor</span>{" "}
                  <span className="text-[#79c0ff]">roomId</span>
                  <span className="text-[#e6edf3]">=</span>
                  <span className="text-[#a5d6ff]">{`{room.id}`}</span>
                  <span className="text-[#e6edf3]">/&gt;;</span>
                </code>
              </pre>
            </div>
          </section>

          {/* Features strip */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-[#8b949e] text-sm">
            <span className="flex items-center gap-2">
              <span className="text-[#3fb950]">✓</span> No install
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#3fb950]">✓</span> Real-time sync
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#3fb950]">✓</span> Multiple languages
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#3fb950]">✓</span> Free forever
            </span>
          </div>
        </div>
      </div>
    </>

  );
};

export default Dashboard;
