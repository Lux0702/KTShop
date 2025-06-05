import Link from "next/link";
import { menuItems  } from "./MenuItem";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clearUser } from "@/redux/features/admin/userSlice";
import { useDispatch } from "react-redux";
const Sidebar = () => {
  const router = useRouter();
  const { asPath } = router;
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("asPath", router);
  }, [asPath]);
  const handleLogout = () => {
    dispatch(clearUser());
    router.push("/admin/login");
  };
  return (
    <div className="sidebar-wrapper">
      <aside className="sidebar">
        <div className="sidebar-title">KTShop</div>
        <nav className="sidebar-nav">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={label}
              className={`sidebar-link ${asPath === path ? "active" : ""}`}
              href={path}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
    </div>
  );
};

export default Sidebar;
