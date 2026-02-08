import Topbar from "@/app/Components/Topbar";

export default function RegisterPage() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-[3rem] text-center mb-8">
          Sign up to save code
        </h1>
      <div className="w-full max-w-lg px-6">

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">
            Your full name
          </label>
          <input
            type="username"
            className="w-full px-3 py-3 bg-blue-50 border border-gray-200 rounded focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">
            Email address
          </label>
          <input
            type="email"
            className="w-full px-3 py-3 bg-blue-50 border border-gray-200 rounded focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-500 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-3 bg-blue-50 border border-gray-200 rounded focus:outline-none"
          />
        </div>

        <button className="w-full bg-pink-500 text-white py-3 rounded mb-6 hover:bg-pink-600">
          Log In
        </button>

        <div className="text-center text-sm">
          <p className="mb-2">
            Already signed up? <a 
             href="/login"
            className="text-blue-600 cursor-pointer">Log in here.</a>
          </p>

        </div>
      </div>
    </div>

  );
}
