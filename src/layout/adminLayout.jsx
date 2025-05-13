import React from "react";
import Sidebar from "@/components/admin/sidebar/sidebar.jsx";
import HeaderAdmin from "@/components/admin/header/HeaderAdmin";
import Breadcrumbs from "@/components/admin/Breadcrumbs";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        <HeaderAdmin />
        <Breadcrumbs />
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
