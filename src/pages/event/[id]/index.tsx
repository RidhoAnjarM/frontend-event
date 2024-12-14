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
                setModalMessage('Pendaftaran berhasil!');
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message || 'Pendaftaran gagal.');
            }
        } catch (error) {
            setModalMessage('Terjadi kesalahan.');
        } finally {
            setRegisterModalOpen(false);
            setMessageModalOpen(true);
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
                <h1 className='text-5xl text-center'>{event.name}</h1>
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
                    <h2 className='text-[20px] mt-[35px]'>Harga</h2>
                    <p className='text-gray-500 text-[15px] font-sans font-bold'>{event.price}</p>
                    <h2 className='text-[20px] mt-[40px]'>Kapasitas</h2>
                    <p className='text-gray-500 font-bold font-sans text-[15px]'><span className='text-custom-purple'>{event.remaining_capacity}</span> tersisa dari <span className='text-black'>{event.capacity}</span></p>
                </div>
                <div className="w-full flex justify-center mt-[20px]">
                    {event.remaining_capacity === 0 ? (
                        <p className="mt-6 w-[250px] h-[50px] bg-custom-purple-light text-white text-[15px] rounded flex items-center justify-center">
                            Kapasitas Event sudah penuh.
                        </p>
                    ) : isRegistered ? (
                        <p className="mt-6 w-[250px] h-[50px] bg-custom-purple-light text-white text-[15px] rounded flex items-center text-center">
                            Anda sudah terdaftar pada event ini.
                        </p>
                    ) : new Date(event.date_end || event.date_start) < new Date() ? ( 
                        <p className="mt-6 w-[250px] h-[50px] bg-custom-purple-light text-white text-[15px] rounded flex items-center text-center">
                            Pendaftaran ditutup karena event telah selesai.
                        </p>
                    ) : (
                        <button
                            onClick={handleRegisterClick}
                            className="mt-6 w-[250px] h-[50px] bg-custom-purple-light text-white rounded hover:bg-white hover:text-custom-purple-light border border-custom-purple-light duration-300 ease-in-out"
                        >
                            Daftar Event
                        </button>
                    )}
                </div>

            </div>
            <div className="w-full px-[120px] grid grid-cols-2">
                <div className="ms-[50px]">
                    <h2 className='text-[24px] mt-[20px]'>Lokasi</h2>
                    <p className='mt-[7px] font-sans text-[16px] text-gray-500 font-bold '>{event.location}. {event.address}</p>
                    <h2 className='text-[24px] mt-[20px]'>Tanggal & Waktu</h2>
                    <p className='mt-[7px] font-sans text-[16px] text-gray-500 font-bold '><span className='me-[13px]'>Mulai</span>: {getDayOfWeek(event.date_start)} {new Date(event.date_start).toLocaleDateString()}</p>
                    <p className='font-sans text-[16px] text-gray-500 font-bold '>Selesai : {getDayOfWeek(event.date_end)} {event.date_end ? new Date(event.date_end).toLocaleDateString() : '-'}</p>
                    <p className='text-custom-purple mt-[7px] text-[16px] ms-[50px]'>{event.time}</p>
                    <div className="flex w-full justify-between">
                        {event.mode === 'online' && event.link ? (
                            <div className="">
                                <h2 className='text-[24px] mt-[20px]'>Link</h2>
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
                    <h2 className='text-[24px] mt-[30px]'>Deskripsi</h2>
                    <p className='mt-[7px] font-sans text-[16px] text-gray-500 font-bold '>{event.description}</p>
                    <h2 className='text-[24px] mt-[30px]'>Keuntungan</h2>
                    <p className='mt-[7px] font-sans text-[16px] text-gray-500 font-bold '>{event.benefits}</p>
                </div>
            </div>


            <div className="w-full px-[120px] mb-[50px] ">
                {event.sessions.length > 0 && (
                    <>
                        <h3 className="mt-[100px] text-xl ms-[50px]">Sesi Event :</h3>
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
                            <h2 className="text-2xl font-bold ms-[50px]">Acara Lainnya</h2>
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
                                    otherEvents.map((event) => (
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
                    <h1 className="text-center text-[20px] mb-4">Anda harus login untuk mendaftar.</h1>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setIsLoginModalOpen(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)}>
                <h1 className='text-center text-[24px]'>Pendaftaran untuk Event</h1>
                <p className='text-center text-custom-purple-1-50'>{event.name}</p>
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
                            Pekerjaan
                        </label>
                    </div>
                    {event?.price !== 'Free' && (
                        <div className="h-12 relative flex rounded-[5px] mt-[25px]">
                            <label
                                className="absolute text-custom-purple-2-100 -top-4 left-3 px-2 font-light  text-[12px]"
                                form='payment_method'>
                                Metode pembayaran
                            </label>
                            <select
                                id="payment_method"
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleInputChange}
                                className='peer w-full bg-opacity-20 outline-none px-4  rounded-[5px] border-2 focus:shadow-md text-custom-purple-2-100'
                                required
                            >
                                <option value="">Pilih Metode</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="E-Wallet">E-Wallet</option>
                            </select>
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
                <h1 className='text-[24px] text-center'>Notifikasi!</h1>
                <p className='text-center mt-4'>{modalMessage}</p>
                <div className="grid justify-center items-center mt-4">
                    <button
                        onClick={() => {
                            setMessageModalOpen(false);
                            window.location.reload();
                        }}
                        className='w-[90px] h-[40px] rounded-md bg-green-500 hover:bg-green-700 text-white'
                    >Tutup</button>
                </div>
            </Modal>

        </div>
    );
};

export default EventDetail;
