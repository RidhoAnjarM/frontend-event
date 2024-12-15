import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Event } from '@/types/types';
import Navmin from '@/components/Navmin';
import Modal from '@/components/modal';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AdminDashboard = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("upcoming");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [eventDetail, setEventDetail] = useState<any>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const [searchQuery, setSearchQuery] = useState<string>("");

    const [isSticky, setIsSticky] = useState(false);
    const [isStuck, setIsStuck] = useState(false);

    const [isRegistrantModalOpen, setIsRegistrantModalOpen] = useState(false);
    const [registrants, setRegistrants] = useState<any[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [isLoadingRegistrants, setIsLoadingRegistrants] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/event`);
                const sortedEvents = response.data.sort((a: Event, b: Event) => b.id - a.id);
                setEvents(sortedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const element = document.getElementById('filter-container');
            if (element) {
                const rect = element.getBoundingClientRect();
                setIsStuck(rect.top <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredEvents = events.filter(event =>
        event.status === selectedStatus &&
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteEvent = async () => {
        if (eventToDelete !== null) {
            try {
                await axios.delete(`${API_URL}/event/${eventToDelete}`);
                setEvents(events.filter(event => event.id !== eventToDelete));
                setEventToDelete(null);
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    const handleOpenModal = (eventId: number) => {
        setEventToDelete(eventId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEventToDelete(null);
    };

    const fetchEventDetail = async (eventId: number) => {
        setIsLoadingDetail(true);
        try {
            const response = await axios.get(`${API_URL}/event/${eventId}`);
            setEventDetail(response.data);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error('Error fetching event detail:', error);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handleCloseDetailModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsDetailModalOpen(false);
            setEventDetail(null);
            setIsClosing(false);
        }, 200);
    };

    const fetchRegistrants = async (eventId: number) => {
        setIsLoadingRegistrants(true);
        try {
            console.log('Fetching registrants for event:', eventId);
            const response = await axios.get(`${API_URL}/events/${eventId}/registered`);
            console.log('Response data:', response.data);
            setRegistrants(response.data.registrants || []);
            setIsRegistrantModalOpen(true);
            setSelectedEventId(eventId);
        } catch (error) {
            console.error('Error fetching registrants:', error);
        } finally {
            setIsLoadingRegistrants(false);
        }
    };

    const selectedEvent = events.find(event => event.id === selectedEventId);

    return (
        <div className="">
            <Navmin />
            <h1 className="text-3xl font-bold mb-6 text-center pt-8 text-gray-800 relative">
                <span className="relative inline-block font-russo">
                    Dashboard
                </span>
            </h1>
            <div className="mt-6 w-full ps-[170px] pe-[20px]">
                <div
                    id="filter-container"
                    className={`w-full bg-custom-navy p-6 rounded-lg mb-6 sticky top-0 z-30 transition-all duration-200 ${isStuck ? 'shadow-xl' : 'shadow-sm'}`}
                >
                    <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <h2 className="text-2xl font-bold text-white">List Acara</h2>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari event..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-[300px] bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200"
                                    >
                                        <option value="upcoming">Akan Datang</option>
                                        <option value="ongoing">Berlangsung</option>
                                        <option value="ended">Selesai</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/admin/event/create')}
                            className='inline-flex items-center gap-2 bg-blue-600 text-white py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md active:transform active:scale-95'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Buat Event Baru
                        </button>
                    </div>
                </div>

                <table className="min-w-full bg-white border border-gray-200 font-sans rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Nama</th>
                            <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Lokasi</th>
                            <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Tanggal</th>
                            <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Waktu</th>
                            <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Kapasitas</th>
                            <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Harga</th>
                            <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Foto</th>
                            <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">
                                    <div className="flex justify-center items-center h-32">
                                        <p className="text-gray-500">Loading...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-4 py-3 text-[15px] text-gray-700">{event.name}</td>
                                    <td className="px-4 py-3 text-[15px] text-gray-700">{event.location} {event.address}</td>
                                    <td className="px-4 py-3 text-[12px] text-center">
                                        <div className="bg-blue-50 rounded-lg px-2 py-1">
                                            {new Date(event.date_start).toLocaleDateString()} <br />
                                            {event.date_end ? new Date(event.date_end).toLocaleDateString() : 'selesai'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[12px] text-gray-700">{event.time}</td>
                                    <td className="px-4 py-3 text-[15px]">
                                        <div className="flex items-center">
                                            <span className="text-gray-700">{event.capacity}</span>
                                            <span className="mx-1 text-gray-400">/</span>
                                            <span className="text-green-600">{event.remaining_capacity}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[15px] font-medium text-gray-900">{event.price}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {event.photo ? (
                                            <img
                                                src={`http://localhost:5000${event.photo}`}
                                                className="w-[100px] h-[60px] object-cover rounded-lg "
                                                onError={(e) => {
                                                    console.log(`Image not found for event: ${event.id}, setting to default.`);
                                                    (e.target as HTMLImageElement).src = 'https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg';
                                                }}
                                                alt="Event Photo"
                                            />
                                        ) : (
                                            <img
                                                src="https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg"
                                                className="w-[100px] h-[60px] object-cover rounded-lg"
                                                alt="Default Event"
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => fetchEventDetail(event.id)}
                                                className="bg-green-500 text-white w-[40px] h-[40px] justify-center rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center text-sm"
                                            >
                                                <img src="../icons/liat.svg" alt="" className='w-[22px]'/>
                                            </button>
                                            <button
                                                onClick={() => fetchRegistrants(event.id)}
                                                className="bg-blue-500 text-white w-[40px] h-[40px] justify-center rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center text-sm"
                                            >
                                                <img src="../icons/user.svg" alt="" />
                                            </button>
                                            <button
                                                onClick={() => router.push(`/admin/event/update?id=${event.id}`)}
                                                className="bg-yellow-500 text-white w-[40px] h-[40px] justify-center rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center text-sm"
                                            >
                                                <img src="../icons/edit.svg" alt="" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(event.id)}
                                                className="bg-red-500 text-white w-[40px] h-[40px] justify-center rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center text-sm"
                                            >
                                               <img src="../icons/delete.svg" alt="" className='w-[20px]' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                                    Tidak ada event yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for confirmation */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div className="p-4">
                        <h2 className="text-lg mb-4">Konfirmasi Hapus</h2>
                        <p>Apakah Anda yakin ingin menghapus event ini?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 border border-gray-300 rounded-md mr-2"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteEvent}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {(isDetailModalOpen || isClosing) && eventDetail && (
                <Modal
                    isOpen={!isClosing}
                    onClose={handleCloseDetailModal}
                >
                    <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-6 mb-6">
                        {isLoadingDetail ? (
                            <div className="flex justify-center items-center h-40">
                                <p>Loading...</p>
                            </div>
                        ) : (
                            <div className="space-y-6 h-full overflow-y-auto pr-2">
                                {/* Header */}
                                <div className="border-b pb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">{eventDetail.name}</h2>
                                    <p className="mt-2 text-gray-600">{eventDetail.description}</p>
                                </div>

                                {/* Info Utama */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Waktu & Tanggal</h3>
                                            <p className="mt-1">
                                                {new Date(eventDetail.date_start).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                                {eventDetail.date_end && (
                                                    <>
                                                        <span className="mx-2">-</span>
                                                        {new Date(eventDetail.date_end).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </>
                                                )}
                                            </p>
                                            <p className="mt-1">{eventDetail.time}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Lokasi</h3>
                                            <p className="mt-1">{eventDetail.location}</p>
                                            {eventDetail.address && (
                                                <p className="mt-1 text-gray-600">{eventDetail.address}</p>
                                            )}
                                        </div>

                                        {eventDetail.mode === 'online' && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-500 uppercase">Link Event</h3>
                                                <p className="mt-1 break-all">
                                                    <a
                                                        href={eventDetail.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline inline-block"
                                                    >
                                                        {eventDetail.link}
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Informasi Event</h3>
                                            <div className="mt-2 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-600">Kategori</p>
                                                    <p>{eventDetail.category}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Mode</p>
                                                    <p className="capitalize">{eventDetail.mode}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Status</p>
                                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${eventDetail.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                        eventDetail.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {eventDetail.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Harga</p>
                                                    <p>{eventDetail.price}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Kapasitas</h3>
                                            <div className="mt-2">
                                                <div className="flex justify-between mb-1">
                                                    <span>{eventDetail.remaining_capacity} tersisa</span>
                                                    <span>{eventDetail.capacity} total</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{
                                                            width: `${(eventDetail.remaining_capacity / eventDetail.capacity) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Rating</h3>
                                            <div className="mt-2 flex items-center">
                                                <span className="text-2xl font-bold">{eventDetail.average_rating}</span>
                                                <span className="ml-2 text-gray-600">({eventDetail.unique_raters} voters)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Benefits */}
                                {eventDetail.benefits && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Benefits</h3>
                                        <p className="text-gray-700">{eventDetail.benefits}</p>
                                    </div>
                                )}

                                {/* Sessions */}
                                {eventDetail.sessions && eventDetail.sessions.length > 0 && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Sesi Event</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pembicara</th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {eventDetail.sessions.map((session: any, index: number) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-sm">{session.date}</td>
                                                            <td className="px-4 py-3 text-sm">{session.time}</td>
                                                            <td className="px-4 py-3 text-sm">{session.speaker}</td>
                                                            <td className="px-4 py-3 text-sm">{session.location}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="border-t pt-4 flex justify-end">
                                    <button
                                        onClick={handleCloseDetailModal}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Modal Registrants */}
            <Modal
                isOpen={isRegistrantModalOpen}
                onClose={() => setIsRegistrantModalOpen(false)}
            >
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">
                        Daftar Peserta - {selectedEvent?.name || 'Event'}
                    </h2>
                    {isLoadingRegistrants ? (
                        <div className="flex justify-center items-center h-40">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {registrants.length > 0 ? (
                                        registrants.map((registrant, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-3 border-b">{registrant.username}</td>
                                                <td className="px-6 py-3 border-b">{registrant.name}</td>
                                                <td className="px-6 py-3 border-b">{registrant.email}</td>
                                                <td className="px-6 py-3 border-b">{registrant.phone}</td>
                                                <td className="px-6 py-3 border-b">{registrant.job}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                Tidak ada peserta terdaftar
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setIsRegistrantModalOpen(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
