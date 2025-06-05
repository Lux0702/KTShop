import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Icons } from "@/components/icons/icons";
import Image from "next/image";
import { clearUser } from "@/redux/features/admin/userSlice";

const HeaderAdmin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);
  const router = useRouter();
  const { slug } = router.query;

  const user = useSelector((state) => state.adminUser.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    console.log("HeaderAdmin mounted", user); 

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
    router.push("/admin/login");
  };

  const navigateTo = (path) => {
    setDropdownOpen(false);
    router.push(path);
  };

  return (
    <header className="header-admin">
      <h1 className="title">{slug?.toUpperCase()}</h1>

      <div className="right-section">
        <button className="notification-button">
          <Icons.Notifications />
          <span className="badge">3</span>
        </button>

        <div className="avatar-menu">
          <button
            className="avatar-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            ref={avatarButtonRef}
          >
            <Image
              src={user?.image || "https://placehold.co/40x40"}
              alt="Avatar"
              width={40}
              height={40}
              style={{ borderRadius: "50%" }}
            />
          </button>

          {dropdownOpen && (
            <div className="dropdown" ref={dropdownRef}>
              <ul>
                <li>
                  <strong>{user?.name || "Admin"}</strong>
                </li>
                <li>
                  <button onClick={() => navigateTo("/admin/dashboard")}>
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo("/admin/profile")}>
                    Account Settings
                  </button>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
