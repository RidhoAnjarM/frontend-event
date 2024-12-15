import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Modal from "../modal";

const Navmin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        router.push("/login");
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

    return (
        <nav>
            <div className="fixed bg-white shadow-lg h-screen w-[150px] flex flex-col  py-4">
                <div className="w-[100px] mx-auto">
                    <img src="../images/logo.png" alt="logo" />
                </div>
                <hr className="mb-[15px] mt-[15px] border border-custom-navy w-[120px] mx-auto rounded-full" />
                <div className="mt-[150px] relative">
                    <div 
                        className="absolute w-[130px] h-[55px] bg-custom-navy rounded-e-full transition-all ease-in-out duration-500"
                        style={{
                            top: router.pathname === "/admin/dashboard" ? "0" :
                                 router.pathname === "/admin/user" ? "55px" :
                                 router.pathname === "/admin/kategori" ? "110px" :
                                 router.pathname === "/admin/lokasi" ? "165px" : "0"
                        }}
                    />
                    <div className="flex flex-col space-y-0">
                        <button
                            onClick={() => router.push("/admin/dashboard")}
                            className={`relative z-10 w-[130px] h-[55px] rounded-e-full transition-all ease-in-out duration-500 ${
                                router.pathname === "/admin/dashboard" ? "text-white" : "text-custom-navy hover:bg-gray-100"
                            }`}
                        >
                            Beranda
                        </button>
                        <button
                            onClick={() => router.push("/admin/user")}
                            className={`relative z-10 w-[130px] h-[55px] rounded-e-full transition-all ease-in-out duration-500 ${
                                router.pathname === "/admin/user" ? "text-white" : "text-custom-navy hover:bg-gray-100"
                            }`}
                        >
                            User
                        </button>
                        <button
                            onClick={() => router.push("/admin/kategori")}
                            className={`relative z-10 w-[130px] h-[55px] rounded-e-full transition-all ease-in-out duration-500 ${
                                router.pathname === "/admin/kategori" ? "text-white" : "text-custom-navy hover:bg-gray-100"
                            }`}
                        >
                            Kategori
                        </button>
                        <button
                            onClick={() => router.push("/admin/lokasi")}
                            className={`relative z-10 w-[130px] h-[55px] rounded-e-full transition-all ease-in-out duration-500 ${
                                router.pathname === "/admin/lokasi" ? "text-white" : "text-custom-navy hover:bg-gray-100"
                            }`}
                        >
                            Lokasi
                        </button>
                    </div>
                    <button
                        onClick={handleConfirmLogout}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 w-full mt-[150px] flex items-center justify-center"
                    >
                        <img src="../icons/logout.svg" alt="" />
                    </button>
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

export default Navmin;
