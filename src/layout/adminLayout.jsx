import React from "react";
import Sidebar from "@/components/admin/sidebar/sidebar.jsx";
import HeaderAdmin from "@/components/admin/header/HeaderAdmin";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-[#f1f5f9]">
      <Sidebar />

      <main className="flex-grow">
        <HeaderAdmin />
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
