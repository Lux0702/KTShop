import React, { useState, useEffect, useRef, use } from "react";
import { Icons } from "@/components/icons/icons";
import { useRouter } from "next/router";

const HeaderAdmin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);
  const router = useRouter();
  const { slug } = router.query;

  const navigateTo = (path) => {
    setDropdownOpen(false);
    router.push(path);
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra xem click có nằm ngoài dropdown và avatar button không
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    // Thêm event listener khi component mount
    document.addEventListener("click", handleClickOutside);

    // Dọn dẹp event listener khi component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <header className="header-admin">
      <h1 className="title">{ slug?.toUpperCase()}</h1>

      <div className="right-section">
        <button className="notification-button">
          <span className="material-icons">
            <Icons.Notifications />
          </span>
          <span className="badge">3</span>
        </button>

        <div className="avatar-menu">
          <button
            className="avatar-button"
            onClick={toggleDropdown}
            ref={avatarButtonRef}
          >
            <img src="/avatar.jpg" alt="Avatar" />
          </button>

          {dropdownOpen && (
            <div className="dropdown" ref={dropdownRef}>
              <ul>
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
                  <button className="logout">Logout</button>
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
