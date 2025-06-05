import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AdminLayout from "@/layout/adminLayout";

const Dashboard = dynamic(() => import("../../components/admin/pages/dashboard"));
const Products = dynamic(() => import("../../components/admin/pages/products"));
const Category = dynamic(() => import("../../components/admin/pages/category"));
const Orders = dynamic(() => import("../../components/admin/pages/orders"));
const Brand = dynamic(() => import("../../components/admin/pages/brand"));
const Coupon = dynamic(() => import("../../components/admin/pages/coupons"));
const Profile = dynamic(() => import("../../components/admin/pages/profile"));
const Staff = dynamic(() => import("../../components/admin/pages/staff"));
const Login  = dynamic(() => import("../../components/admin/pages/login"));
const Reviews = dynamic(() => import("../../components/admin/pages/reviews"));

const allowedRoles = ["Admin", "Manager", "CEO"];

const AdminSlugPage = () => {
  const { query, push } = useRouter();
  const slug = query.slug;

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (slug === "login") {
      setIsAuthorized(true);
      return;
    }

    const checkAuth = () => {
      const userData = localStorage.getItem("adminUser");
      if (!userData) {
        push("/admin/login");
        return;
      }

      try {
        const parsed = JSON.parse(userData);
        if (allowedRoles.includes(parsed.role)) {
          setIsAuthorized(true);
        } else {
          push("/admin/login");
        }
      } catch (error) {
        console.error("Failed to parse user data", error);
        push("/admin/login");
      }
    };

    checkAuth();

    // Optional: Lắng nghe thay đổi localStorage từ các tab khác
    const handleStorageChange = (e) => {
      if (e.key === "adminUser") {
        checkAuth(); // kiểm tra lại nếu user bị đổi
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [slug]);
  


  const renderPage = () => {
    switch (slug) {
      case "login":
        return <Login />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "category":
        return <Category />;
      case "brand":
        return <Brand />;
      case "coupons":
        return <Coupon />;
        case "reviews":
        return <Reviews />;

      case "profile":
        return <Profile />;
      case "staff":
        return <Staff />;
      case "dashboard":
      case undefined:
        return <Dashboard />;
      default:
        return <div>404 - Page not found</div>;
    }
  };

 if (!isAuthorized) return null;

if (slug === "login") {
  return renderPage(); // render trang login trực tiếp
}

return <AdminLayout>{renderPage()}</AdminLayout>;

};

export default AdminSlugPage;
