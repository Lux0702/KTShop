import Link from "next/link";
import { menuItems  } from "./MenuItem";
import { useRouter } from "next/router";
import { useEffect } from "react";
const Sidebar = () => {
  const router = useRouter();
  const { asPath } = router;
  useEffect(() => {
    console.log("asPath", router);
  }, [asPath]);
  return (
    <div className="flex">
      <aside className="w-64 min-h-screen bg-white shadow-lg">
        <div className="p-4 border-b border-gray-300 font-bold text-xl text-center ">
          KTShop
        </div>
        <nav className="flex flex-col space-y-2 p-4">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={label}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-xl font-medium cursor-pointer"
              href={path}
              style={{
                backgroundColor: asPath === path ? "#f0f0f0" : "transparent",
                color: asPath === path ? "#000" : "#555",
              }}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <button className="bg-red-400 w-fit  flex-1 items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-xl font-medium cursor-pointer">
          Logout
        </button>

      </aside>
    </div>
  );
};

export default Sidebar;
