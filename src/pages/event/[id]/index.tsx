import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Event } from '@/types/types';
import Modal from '@/components/modal';
import Footer from '@/components/footer';
import EventOther from '@/components/EventOther';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EventDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [event, setEvent] = useState<Event | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [isMessageModalOpen, setMessageModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        job: '',
        payment_method: '',
    });
    const [modalMessage, setModalMessage] = useState('');
    const [otherEvents, setOtherEvents] = useState<Event[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [showPaymentReceipt, setShowPaymentReceipt] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            setIsLoggedIn(Boolean(token));
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchOtherEvents();
        }
    }, [isLoggedIn]);

    const fetchOtherEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('User is not logged in. Skipping fetchOtherEvents.');
                return;
            }

            const response = await axios.get(`${API_URL}/events/unregister`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (Array.isArray(response.data.unregistered_events)) {
                setOtherEvents(response.data.unregistered_events);
            } else {
                console.error('Unexpected API response structure:', response.data);
            }
        } catch (error) {
            console.error('Error fetching other events:', error);
        }
    };

    useEffect(() => {
        const fetchEventDetail = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/event/${id}`
                );
                setEvent(response.data);
            } catch (error) {
                console.error('Error fetching event detail:', error);
            }
        };

        const checkRegistrationStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token || !id) return;

            try {
                const response = await axios.get(
                    `${API_URL}/events/${id}/check-registration`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setIsRegistered(response.data.isRegistered);
            } catch (error) {
                console.error('Error checking registration status:', error);
            }
        };

        if (id) {
            fetchEventDetail();
            checkRegistrationStatus();
        }
    }, [id]);

    const getDayOfWeek = (dateString: string) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    const handleRegisterClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoginModalOpen(true);
        } else {
            setRegisterModalOpen(true);
        }
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (event?.price !== 'Free' && !selectedPayment) {
            setModalMessage('Silakan pilih metode pembayaran');
            setMessageModalOpen(true);
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/events/${id}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setRegisterModalOpen(false);
                if (event?.price !== 'Free') {
                    setShowPaymentReceipt(true);
                } else {
                    setModalMessage('Pendaftaran berhasil!');
                    setMessageModalOpen(true);
                }
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message || 'Pendaftaran gagal.');
                setMessageModalOpen(true);
            }
        } catch (error) {
            setModalMessage('Terjadi kesalahan.');
            setMessageModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    useEffect(() => {
        fetchOtherEvents();
    }, []);

    if (!event) {
        return <div className='w-full mt-[400px] justify-center flex items-center'>
            <div className="flex flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
                <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
            </div>
        </div>;
    }

    return (
        <div className="w-full bg-white">

            <div className="flex w-full pt-[50px] relative z-0">
                <div className="w-[1300px] h-[600px] mx-auto overflow-hidden rounded-[10px] bg-cover justify-center items-center flex">
                    {event.photo ? (
                        <img
                            src={`http://localhost:5000${event.photo}`}
                            className="w-full bg-cover"
                            onError={(e) => {
                                console.log(`Image not found for event: ${event.id}, setting to default.`);
                                (e.target as HTMLImageElement).src = 'https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg';
                            }}
                        />
                    ) : (
                        <img src="https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg" alt="" />
                    )}
                </div>
            </div>
            <div className="w-[1300px] h-[600px] absolute z-10 bg-black bg-opacity-50 top-0 mt-[50px] ms-[110px] rounded-[10px]"></div>
            <button onClick={() => router.push('/')} className='w-[50px] h-[50px] rounded-full absolute z-10 ms-[140px] top-0 mt-[70px] flex justify-center items-center hover:bg-black hover:bg-opacity-25 duration-300 ease-in-out '><img src="../icons/back.png" alt="" /></button>
            <div className="absolute w-[400px] top-56 z-10 text-white ms-[250px] rounded-[5px] text-wrap">
                <h1 className='text-5xl text-center font-russo'>{event.name}</h1>
                <div className="flex gap-5 w-full justify-center items-center mt-10">
                    <p className='flex gap-2'><img src="../icons/bintang.svg" alt="" />{event.average_rating} ( {event.unique_raters} )</p>
                    <p className='font-sans'> || </p>
                    <p>{event.category}</p>
                    <p className='font-sans'> || </p>
                    <p>{event.mode}</p>
                </div>
            </div>

            <div className="w-[300px] h-[300px] bg-white rounded-[10px] -mt-[450px] ms-[1000px] z-20 absolute shadow-custom">
                <div className="text-center">
                    <h2 className='text-[20px] mt-[35px] font-russo'>Harga</h2>
                    <p className='text-gray-500 text-[15px] font-sans font-bold'>{event.price}</p>
                    <h2 className='text-[20px] mt-[40px] font-russo'>Kapasitas</h2>
                    <p className='text-gray-500 font-bold font-sans text-[15px]'><span className='text-custom-purple'>{event.remaining_capacity}</span> tersisa dari <span className='text-black'>{event.capacity}</span></p>
                </div>
                <div className="w-full flex justify-center items-center mt-[20px]">
                    {event.remaining_capacity === 0 ? (
                        <p className="mt-6 w-[250px] h-[50px] bg-custom-purple-light text-white text-[12px] rounded flex items-center justify-center">
                            Kapasitas Event sudah penuh.
                        </p>
                    ) : isRegistered ? (
                        <p className="mt-6 w-[250px] h-[50px] bg-custom-purple-light text-white text-[12px] rounded flex items-center justify-center">
                            Anda sudah terdaftar pada event ini.
                        </p>
                    ) : new Date(event.date_end || event.date_start) < new Date() ? (
                        <p className="mt-6 w-[250px] h-[50px] bg-custom-purple-light text-white text-[12px] rounded flex items-center justify-center">
                            Pendaftaran ditutup karena event telah selesai.
                        </p>
                    ) : (
                        <button
                            onClick={handleRegisterClick}
                            className="mt-6 w-[250px] font-russo h-[50px] bg-custom-purple-light text-white rounded hover:bg-white hover:text-custom-purple-light border border-custom-purple-light duration-300 ease-in-out"
                        >
                            Daftar Event
                        </button>
                    )}
                </div>

            </div>
            <div className="w-full px-[120px] grid grid-cols-2">
                <div className="ms-[50px]">
                    <h2 className='text-[24px] mt-[20px] font-russo'>Lokasi</h2>
                    <p className='mt-[7px] font-sans text-[16px] text-gray-500 font-bold '>{event.location}. {event.address}</p>
                    <h2 className='text-[24px] mt-[20px] font-russo'>Tanggal & Waktu</h2>
                    <p className='mt-[7px] font-sans text-[16px] text-gray-500 font-bold '><span className='me-[13px]'>Mulai</span>: {getDayOfWeek(event.date_start)} {new Date(event.date_start).toLocaleDateString()}</p>
                    <p className='font-sans text-[16px] text-gray-500 font-bold '>Selesai : {getDayOfWeek(event.date_end)} {event.date_end ? new Date(event.date_end).toLocaleDateString() : '-'}</p>
                    <p className='text-custom-purple mt-[7px] text-[16px] ms-[50px]'>{event.time}</p>
                    <div className="flex w-full justify-between">
                        {event.mode === 'online' && event.link ? (
                            <div className="">
                                <h2 className='text-[24px] mt-[20px] font-russo'>Link</h2>
                                <a href="#" rel="noopener noreferrer" className="mt-[7px] font-sans text-[16px] text-custom-purple font-bold ">
                                    {event.link}
                                </a>
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
                <div className="ps-[20px]">
                    <h2 className='text-[24px] mt-[30px] font-russo'>Deskripsi</h2>
                    <p className='mt-[7px] font-sans text-[16px] text-gray-500 font-bold '>{event.description}</p>
                    <h2 className='text-[24px] mt-[30px] font-russo'>Keuntungan</h2>
                    <p className='mt-[7px] font-sans text-[16px] text-gray-500 font-bold '>{event.benefits}</p>
                </div>
            </div>


            <div className="w-full px-[120px] mb-[50px] ">
                {event.sessions.length > 0 && (
                    <>
                        <h3 className="mt-[100px] text-xl ms-[50px] font-russo">Sesi Event :</h3>
                        <div className="grid m-4 grid-cols-4">
                            {event.sessions.map((session: {
                                id: Key | null | undefined;
                                time: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
                                date: string | number | Date;
                                speaker: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
                                location: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
                            }) => (
                                <div key={session.id} className="m-4 p-4 border-2 rounded-lg w-[300px]">
                                    <h4 className="font-sans text-[16px] text-gray-500 font-bold"><span className='me-[35px] text-black'>Waktu</span>: {session.time || '-'}</h4>
                                    <p className="font-sans text-[16px] text-gray-500 font-bold">
                                        <span className="me-[25px] text-black">Tanggal</span>:{" "}
                                        {session.date && getDayOfWeek(new Date(session.date).toString())}, {new Date(session.date).toLocaleDateString()}
                                    </p>
                                    <p className="font-sans text-[16px] text-gray-500 font-bold"><span className='me-[6px] text-black'>Pembicara</span>: {session.speaker || '-'}</p>
                                    <p className="font-sans text-[16px] text-custom-purple font-bold"><span className='me-[37px] text-black'>Lokasi</span>: {session.location || '-'}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <hr className='border border-custom-navy w-[1200px] mx-auto rounded-full mt-10' />

            <div className="px-[120px] mb-10">
                {isLoggedIn ? (
                    <>
                        <div className="mt-12 mb-4 flex justify-between">
                            <h2 className="text-2xl ms-[50px] font-russo">Acara Lainnya</h2>
                            <button
                                onClick={() => router.push("/landing")}
                                className="text-custom-purple hover:text-custom-purple-light duration-300 ease-in-out"
                            >
                                lihat semua
                            </button>
                        </div>
                        <div className="relative">
                            <button
                                onClick={scrollLeft}
                                className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
                            >
                                &#8249;
                            </button>

                            <div
                                ref={scrollContainerRef}
                                className="flex overflow-x-auto gap-[6px] [&::-webkit-scrollbar]:hidden overflow-hidden"
                            >
                                {otherEvents.length === 0 ? (
                                    <div className="flex items-center justify-center w-full h-[200px]">
                                        <div className="flex flex-row gap-2">
                                            <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
                                            <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.3s]"></div>
                                            <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
                                        </div>
                                    </div>
                                ) : (
                                    otherEvents
                                        .filter(event => event.status === 'upcoming' || event.status === 'ongoing')
                                        .map((event) => (
                                            <div key={event.id} className="flex-shrink-0 w-80">
                                                <EventOther eventOther={event} />
                                            </div>
                                        ))
                                )}
                            </div>
                            <button
                                onClick={scrollRight}
                                className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
                            >
                                &#8250;
                            </button>
                        </div>
                    </>
                ) : null}
            </div>

            <Footer />

            <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
                <div className="p-4">
                    <h1 className="text-center text-[20px] mb-4 font-russo">Notifikasi</h1>
                    <p className='text-center mb-4'>Anda harus Login terlebih dahulu sebelum mendaftar!!</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setIsLoginModalOpen(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-custom-navy text-white px-4 py-2 rounded hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)}>
                <h1 className='text-center text-[24px] font-russo'>Pendaftaran untuk Event</h1>
                <p className='text-center text-custom-purple-1-50 font-russo'>{event.name}</p>
                <form onSubmit={handleFormSubmit} className='px-[20px]'>
                    <div className="h-12 relative flex rounded-[5px] mt-10">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            autoComplete='off'
                            className='peer w-full bg-opacity-20 outline-none px-4 rounded-[5px] border-2 focus:shadow-md text-custom-purple-2-100'
                            required
                        />
                        <label
                            className="absolute text-custom-purple-2-100 top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-[12px] peer-focus:text-custom-purple-2-100 peer-valid:-top-2 peer-valid:left-3 peer-valid:text-[12px] peer-valid:text-custom-purple-2-100 duration-150"
                            form='nama'>
                            Nama Lengkap
                        </label>
                    </div>
                    <div className="h-12 relative flex rounded-[5px] mt-[25px]">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className='peer w-full bg-opacity-20 outline-none px-4  rounded-[5px] border-2 focus:shadow-md text-custom-purple-2-100'
                            required
                        />
                        <label
                            className="absolute text-custom-purple-2-100 top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-[12px] peer-focus:text-custom-purple-2-100 peer-valid:-top-2 peer-valid:left-3 peer-valid:text-[12px] peer-valid:text-custom-purple-2-100 duration-150"
                            form='email'>
                            Email
                        </label>
                    </div>
                    <div className="h-12 relative flex rounded-[5px] mt-[25px]">
                        <input
                            type="number"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            autoComplete='off'
                            className='peer w-full bg-opacity-20 outline-none px-4  rounded-[5px] border-2 focus:shadow-md text-custom-purple-2-100'
                            required
                        />
                        <label
                            className="absolute text-custom-purple-2-100 top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-[12px] peer-focus:text-custom-purple-2-100 peer-valid:-top-2 peer-valid:left-3 peer-valid:text-[12px] peer-valid:text-custom-purple-2-100 duration-150"
                            form='phone'>
                            No Telepon
                        </label>
                    </div>
                    <div className="h-12 relative flex rounded-[5px] mt-[25px]">
                        <input
                            type="text"
                            id="job"
                            name="job"
                            value={formData.job}
                            onChange={handleInputChange}
                            autoComplete='off'
                            className='peer w-full bg-opacity-20 outline-none px-4  rounded-[5px] border-2 focus:shadow-md text-custom-purple-2-100'
                            required
                        />
                        <label
                            className="absolute text-custom-purple-2-100 top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-[12px] peer-focus:text-custom-purple-2-100 peer-valid:-top-2 peer-valid:left-3 peer-valid:text-[12px] peer-valid:text-custom-purple-2-100 duration-150"
                            form='job'>
                            Pekerjaan/Organisasi
                        </label>
                    </div>
                    {event?.price !== 'Free' && (
                        <div className="h-12 relative flex rounded-[5px] mt-[25px]">
                            <button
                                type="button"
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="w-full py-2 px-4 border-2 rounded-[5px] text-left text-custom-purple-2-100"
                            >
                                {selectedPayment || 'Pilih Metode Pembayaran'}
                            </button>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 mt-[50px]">
                        <button
                            type="button"
                            onClick={() => setRegisterModalOpen(false)}
                            className="bg-white text-custom-purple-light rounded-[5px] border border-custom-purple-light w-[90px] h-[40px] hover:bg-custom-purple-light hover:text-white duration-300 ease-in-out"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-custom-purple-light w-[90px] g-[40px] flex items-center justify-center text-white border border-custom-purple-light rounded-[5px] hover:bg-white hover:text-custom-purple-light duration-300 ease-in-out"
                        >
                            {loading ? (
                                <div className="flex flex-row gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:.7s]"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:.3s]"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:.7s]"></div>
                                </div>
                            ) : (
                                "Daftar"
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isMessageModalOpen} onClose={handleCloseLoginModal}>
                <div className="p-6 text-center">
                    <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                        <svg
                            className="w-8 h-8 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <h1 className='text-2xl font-semibold text-gray-800 mb-2'>
                        Pendaftaran Berhasil!
                    </h1>

                    <p className='text-gray-600 mb-4'>
                        {modalMessage}
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <svg
                                className="w-5 h-5 text-custom-purple"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="text-sm text-gray-600">Detail pendaftaran telah dikirim ke email Anda</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Mohon periksa folder Inbox atau Spam di email Anda
                        </p>
                    </div>

                    <div className="space-y-3 mb-6 text-left bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800">Langkah selanjutnya:</h3>
                        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                            <li>Periksa email Anda untuk detail lengkap event</li>
                            <li>Simpan informasi pendaftaran</li>
                            {event?.mode === 'online' && (
                                <li>Link meeting akan dikirim H-1 acara</li>
                            )}
                            {event?.mode === 'offline' && (
                                <li>Tunjukkan bukti pendaftaran saat check-in</li>
                            )}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => {
                                setMessageModalOpen(false);
                                window.location.reload();
                            }}
                            className='w-full py-2.5 bg-custom-purple-light text-white rounded-md hover:bg-white hover:text-custom-navy border border-custom-navy transition-colors duration-300 ease-in-out font-medium'
                        >
                            Selesai
                        </button>
                        <button
                            onClick={() => {
                                setMessageModalOpen(false);
                                router.push('/profile');
                            }}
                            className='w-full py-2.5 border border-custom-purple-light text-custom-purple-light rounded-md hover:bg-custom-purple-light hover:text-white transition-colors duration-300 ease-in-out font-medium'
                        >
                            Lihat Event Saya
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
                <h2 className="text-xl font-semibold mb-4 text-center">Pilih Metode Pembayaran</h2>
                <div className="p-6 h-[550px] overflow-hidden overflow-y-scroll">
                    <div className="space-y-5">
                        <div className="payment-group">
                            <h3 className="font-medium mb-2">E-Wallet</h3>
                            <div className="space-y-2">
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="GoPay"
                                        checked={selectedPayment === 'GoPay'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3"
                                    />
                                    <img src="https://i.pinimg.com/736x/04/62/6d/04626d8f419bb651188bfc3c88b55516.jpg" alt="GoPay" className="h-6 w-6 mr-2" />
                                    <span>GoPay</span>
                                </label>
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="OVO"
                                        checked={selectedPayment === 'OVO'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3"
                                    />
                                    <img src="https://i.pinimg.com/736x/76/1a/bf/761abfb9e4c628b0f4b9943c390e93b3.jpg" alt="OVO" className="h-6 w-6 mr-2" />
                                    <span>OVO</span>
                                </label>
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="DANA"
                                        checked={selectedPayment === 'DANA'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3"
                                    />
                                    <img src="https://i.pinimg.com/736x/f5/8c/a3/f58ca3528b238877e9855fcac1daa328.jpg" alt="DANA" className="h-6 w-6 mr-2" />
                                    <span>DANA</span>
                                </label>
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="ShoppeePay"
                                        checked={selectedPayment === 'ShoppeePay'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3"
                                    />
                                    <img src="https://i.pinimg.com/736x/d0/19/16/d019163d861908ed0046391ebfa42ce1.jpg" alt="ShoppeePay" className="h-4 w-6 mr-2" />
                                    <span>ShoppeePay</span>
                                </label>
                            </div>
                        </div>

                        <div className="payment-group">
                            <h3 className="font-medium mb-2">Transfer Bank</h3>
                            <div className="space-y-2">
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="BCA"
                                        checked={selectedPayment === 'BCA'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3"
                                    />
                                    <img src="https://i.pinimg.com/736x/8c/14/00/8c14002029a523a0cbaf65dd59306a43.jpg" alt="BCA" className="h-6 w-8 mr-2" />
                                    <span>BCA</span>
                                </label>
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Mandiri"
                                        checked={selectedPayment === 'Mandiri'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3"
                                    />
                                    <img src="https://i.pinimg.com/736x/1b/1e/ae/1b1eae66e95098ca6c3b34a2080e0c5e.jpg" alt="Mandiri" className="h-4 w-8 mr-2" />
                                    <span>Mandiri</span>
                                </label>
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="BNI"
                                        checked={selectedPayment === 'BNI'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3"
                                    />
                                    <img src="https://i.pinimg.com/736x/ad/b4/9a/adb49ad451585446c85d348e50a16306.jpg" alt="BNI" className="h-6 w-8 mr-2" />
                                    <span>BNI</span>
                                </label>
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="BRI"
                                        checked={selectedPayment === 'BRI'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3"
                                    />
                                    <img src="https://i.pinimg.com/736x/f8/89/3c/f8893c524e737a00d7aabc02a1737ce9.jpg" alt="BRI" className="h-4 w-8 mr-2" />
                                    <span>BRI</span>
                                </label>
                            </div>
                        </div>

                        <div className="payment-group">
                            <h3 className="font-medium mb-2">Kartu Kredit</h3>
                            <div className="space-y-2">
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Credit Card"
                                        checked={selectedPayment === 'Credit Card'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3"
                                    />
                                    <div className="flex gap-2">
                                        <img src="https://i.pinimg.com/736x/3d/d3/de/3dd3de3c0ea439adcd71d4531e0e181c.jpg" alt="Visa" className="h-6" />
                                        <img src="https://i.pinimg.com/736x/b5/92/2a/b5922ac3c2e660a7433b465582369a33.jpg" alt="Mastercard" className="h-6" />
                                    </div>
                                    <span className="ml-2">Kartu Kredit</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsPaymentModalOpen(false)}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({ ...formData, payment_method: selectedPayment });
                                setIsPaymentModalOpen(false);
                            }}
                            className="px-4 py-2 bg-custom-navy text-white rounded-md hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                            disabled={!selectedPayment}
                        >
                            Pilih Pembayaran
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showPaymentReceipt} onClose={() => {
                setShowPaymentReceipt(false);
                window.location.reload();
            }}>
                <div className="p-6 max-w-md mx-auto">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Pembayaran Berhasil!</h2>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Detail Transaksi</h3>
                            <p className="text-sm text-gray-600">ID Transaksi: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                            <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Event</span>
                                <span className="font-medium">{event?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Metode Pembayaran</span>
                                <span className="font-medium">{selectedPayment}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nama</span>
                                <span className="font-medium">{formData.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email</span>
                                <span className="font-medium">{formData.email}</span>
                            </div>

                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-800 font-medium">Total Pembayaran</span>
                                    <span className="text-lg font-semibold text-custom-purple">{event?.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-sm text-gray-600">
                            Bukti pembayaran telah dikirim ke email Anda
                        </p>
                        <button
                            onClick={() => {
                                setShowPaymentReceipt(false);
                                window.location.reload();
                            }}
                            className="w-full bg-custom-purple-light text-white py-2 rounded-md hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default EventDetail;
