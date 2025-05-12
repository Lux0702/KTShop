import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Orders from "@/components/admin/pages/Orders";
import AdminLayout from "@/layout/adminLayout";
const Dashboard = dynamic(() =>
  import("../../components/admin/pages/dashboard")
);
const Products = dynamic(() => import("../../components/admin/pages/products"));
const Category = dynamic(() => import("../../components/admin/pages/category"));
const AdminSlugPage = () => {
  const { query } = useRouter();
  const slug = query.slug;

  const renderPage = () => {
    switch (slug) {
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "dashboard":
        return <Dashboard />;
      case undefined:
        return <Dashboard />;
      default:
        return <div>404 - Page not found</div>;
    }
  };

  return (
    <AdminLayout>{renderPage()}</AdminLayout>
  );
};

export default AdminSlugPage;
