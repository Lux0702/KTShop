import React, { useState, useEffect, useRef, use } from "react";
import { Icons } from "@/components/icons/icons";
import { useRouter } from "next/router";

const HeaderAdmin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
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
            <img src={user?.image || "/avatar.jpg"} alt="Avatar" />
          </button>

          {dropdownOpen && (
            <div className="dropdown" ref={dropdownRef}>
              <ul>
                <li><strong>{user?.name || "Admin"}</strong></li>
                <li><button onClick={() => navigateTo("/admin/dashboard")}>Dashboard</button></li>
                <li><button onClick={() => navigateTo("/admin/profile")}>Account Settings</button></li>
                <li><button onClick={handleLogout} className="logout">Logout</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


export default HeaderAdmin;
