import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Modal from "../modal";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setIsLoggedIn(true);
      setUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername(null);
    router.push("/login");
  };

  const handleAccount = () => {
    setShowDropdown((prev) => !prev);
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(true);
    setShowDropdown(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav>
      <div
        className={`w-full h-[113px] flex items-center justify-between px-[120px] fixed top-0 bg-custom-grey z-40 bg-opacity-70 backdrop-blur-sm transition-shadow duration-300 ${isScrolled ? "shadow-md" : ""
          }`}
      >
        <div className="w-[100px]">
          <img src="../images/logo.png" alt="logo" />
        </div>
        <div className="">
          <button
            onClick={() => router.push("/")}
            className={`m-7 ${router.pathname === "/"
              ? "border-b-[4px] border-custom-navy"
              : ""
              }`}
          >
            Beranda
          </button>
          <button
            onClick={() => router.push("#")}
            className={`m-7 ${router.pathname === "#"
              ? "border-b-[4px] border-custom-navy"
              : ""
              }`}
          >
            Tentang
          </button>
          <button
            onClick={() => router.push("#")}
            className={`m-7 ${router.pathname === "#" ? "border-b-[4px] border-custom-navy" : ""
              }`}
          >
            Kontak
          </button>
        </div>
        <div>
          {!isLoggedIn ? (
            <div className="">
              <button
                onClick={() => router.push("/login")}
                className="text-black text-[20px] me-[29px]"
              >
                LogIn
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-4 py-2 border-black border-[2px] bg-white text-black text-[20px] rounded-lg w-[137px] h-[53px]"
              >
                SignUp
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleAccount}
                ref={buttonRef}
                className="px-4 py-2 ring-1 ring-black bg-white text-black text-[16px] rounded-[10px] w-[150px] h-[53px] focus:ring-black duration-300 shadow-md focus:shadow-lg focus:shadow-black overflow-hidden"
              >
                {username}
              </button>
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute mt-2 right-15 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-[200px]"
                >
                  <button
                    onClick={goToProfile}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                  >
                    Lihat Profil
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Modal isOpen={showLogoutModal} onClose={cancelLogout}>
        <div className="p-4">
          <h2 className="text-lg mb-4">Konfirmasi Logout</h2>
          <p>Apakah Anda yakin ingin keluar?</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={cancelLogout}
              className="px-4 py-2 border border-gray-300 rounded-md mr-2"
            >
              Batal
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
