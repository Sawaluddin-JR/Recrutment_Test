import React from "react";

const HomeModerator = () => {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Selamat datang, Moderator!</h1>
      <p className="text-gray-400 mb-4">
        Pantau aktivitas admin dan kandidat di perusahaan.
      </p>
      <div className="space-y-4">
        <button className="w-full bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg text-white font-semibold">
          Statistik Tes
        </button>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-semibold">
          Manajemen Admin
        </button>
      </div>
    </div>
  );
};

export default HomeModerator;