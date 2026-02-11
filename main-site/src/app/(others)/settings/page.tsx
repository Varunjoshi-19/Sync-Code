"use client";

import { useRoomStore } from "@/app/Store/store";

export default function SettingsPage() {
  
  const {user} = useRoomStore();
 
  if(!user) return null;
  
  return (
      <div className="min-h-screen bg-gray-50 px-8 py-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-light text-gray-900 mb-10">
            Account Settings
          </h1>
  
          <form className="space-y-6 mb-16">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Your full name
              </label>
              <input
                type="text"
                defaultValue={user.fullName}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
  
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Email address
              </label>
              <input
              disabled={true}
                type="email"
                defaultValue={user.email}
                className="w-full border opacity-70 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
  
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
  
            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-md text-sm font-medium transition"
            >
              Save
            </button>
          </form>
  
          <section className="mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Plan</h2>
            <p className="text-gray-700 text-sm">
              You’re on our <span className="font-medium">Free plan</span>.{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Switch plans here.
              </a>
            </p>
          </section>
  
          <section>
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Cancel Account
            </h2>
            <p className="text-gray-700 text-sm mb-4 max-w-lg">
              Cancelling your account will remove all CodeSync that you have
              saved. You will no longer be able to access them and your account
              will be deleted.
            </p>
  
            <button className="text-red-500 hover:underline text-sm">
              Cancel Account
            </button>
          </section>
        </div>
      </div>
    );
  }
  