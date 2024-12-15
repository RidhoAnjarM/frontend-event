import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Modal from '@/components/modal';
import Footer from '@/components/footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register({ username, password });
            setModalMessage('Pendaftaran akun telah berhasil');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                router.push('/login');
            }, 4000);
        } catch (error: any) {
            console.error('Registration failed:', error);
            setModalMessage('Registration failed: ' + (error?.response?.data?.error || 'Unknown error occurred'));
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: { username: string; password: string }) => {
        const response = await axios.post(`${API_URL}/register`, data);
        return response.data;
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <div>
            <div className='w-full flex justify-between'>
                <div className="w-[600px] h-[750px] bg-slate-800 flex justify-center items-center overflow-hidden">
                    <img src="https://i.pinimg.com/736x/dd/80/0c/dd800c8743ea05606fb4b976cfa83dc1.jpg" alt="" className='w-[600px] relative mb-[300px]' />
                    <div className="text-white bg-black bg-opacity-40 w-[132px] h-[49px] rounded-[5px] flex justify-center items-center absolute">
                        <a href="/login">SigIn</a>
                    </div>
                </div>
                <div className="w-[840px] h-[750px] flex justify-center items-center">
                    <div className="w-[578px] h-[640px]">
                        <img src="../images/logo.png" alt="" className='w-[100px] mx-auto' />
                        <h1 className='text-[36px] text-center mb-[40px]'>Mendaftar ke Acara</h1>
                        <form onSubmit={handleRegister}>

                            <div className="mt-[40px]">
                                <label htmlFor="user">Username</label>
                                <input
                                    id='user'
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter Your Username"
                                    required
                                    className='w-[578px] h-[46px] border-none text-gray-900 bg-slate-100 px-9 mt-[15px]'
                                />
                            </div>
                            <div className="mt-[40px]">
                                <label htmlFor="pw">Password</label>
                                <input
                                    id='pw'
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className='w-[578px] h-[46px] border-none text-gray-900 bg-slate-100 px-9 mt-[15px]'
                                />
                            </div>
                            <div className="mt-[50px] w-full flex justify-center">
                                <button type="submit" className='bg-custom-navy w-[257px] h-[40px] rounded-[5px] text-white text-[16px] border-2 border-custom-navy hover:bg-white hover:text-custom-navy duration-300 ease-in-out flex items-center justify-center'>
                                    {loading ? (
                                        <div className="flex flex-row gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:.7s]"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:.3s]"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:.7s]"></div>
                                        </div>
                                    ) : (
                                        "SigUp"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <Modal isOpen={showModal} onClose={handleCloseModal}>
                    <h1 className='text-center mt-4 mb-4'>Notifikasi</h1>
                    <h2 className="text-lg mb-4 text-center">{modalMessage}</h2>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleCloseModal}
                            className="px-6 py-2 bg-custom-navy text-white rounded-md hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                        >
                            Tutup
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Register;
