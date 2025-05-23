import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import AdminLayout from "@/layout/adminLayout";
const Dashboard = dynamic(() =>
  import("../../components/admin/pages/dashboard")
);
const Products = dynamic(() => import("../../components/admin/pages/products"));
const Category = dynamic(() => import("../../components/admin/pages/category"));
const Orders = dynamic(() => import("../../components/admin/pages/orders"));
const Brand = dynamic(() => import("../../components/admin/pages/brand"));
const AdminSlugPage = () => {
  const { query } = useRouter();
  const slug = query.slug;

  const renderPage = () => {
    switch (slug) {
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "category":
        return <Category />;
      case "brand":
        return <Brand/>
      case "dashboard":
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
