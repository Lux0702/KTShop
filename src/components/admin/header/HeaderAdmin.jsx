import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const HeaderAdmin = () => {

    return (
        <header className="w-full h-[77px] bg-white flex items-center justify-between border-b border-gray-300 px-4">
        <h1 className="text-xl font-semibold">Header Admin</h1>
      
        <div className="flex items-center gap-6">
          {/* Nút thông báo */}
          <button className="relative">
            <span className="material-icons">notifications</span>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
      
          {/* Avatar User với menu dropdown */}
          <div className="relative">
            {/* <button className="flex items-center gap-2">
              <img src="/path-to-avatar.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
              <span className="text-sm">Username</span>
            </button> */}
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-300 rounded-lg hidden group-hover:block">
              <ul className="p-2">
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Dashboard</button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Account Settings</button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      
    );
}
export default HeaderAdmin;