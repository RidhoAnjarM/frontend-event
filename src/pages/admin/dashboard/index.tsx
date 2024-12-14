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
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/event`);
                const sortedEvents = response.data.sort((a: Event, b: Event) => b.id - a.id);
                setEvents(sortedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

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

    const handleViewRegistrants = (eventId: number) => {
        router.push(`/events/${eventId}/registered`);
    };

    return (
        <div className="">
            <Navmin />
            <h1 className="text-3xl font-bold mb-4 text-center pt-5">Admin Dashboard</h1>
            <div className="mt-6 w-full ps-[170px] pe-[20px]">
                <div className="w-full flex justify-between items-center">
                    <h2 className="text-2xl font-semibold mb-4">List Event</h2>
                    <button onClick={() => router.push('/admin/event/create')}>create event</button>
                </div>
                <table className="min-w-full bg-white border border-gray-200 font-sans">
                    <thead className="">
                        <tr>
                            <th className="text-left border-b w-[150px]">Nama</th>
                            <th className="text-left border-b w-[230px]">Lokasi</th>
                            <th className="text-left border-b w-[100px]">Tanggal</th>
                            <th className="text-left border-b w-[100px]">Waktu</th>
                            <th className="text-left border-b w-[100px]">Kapasitas</th>
                            <th className="text-left border-b w-[150px]">Harga</th>
                            <th className="text-left border-b w-[100px]">Status</th>
                            <th className="text-left border-b w-[150px]">Foto</th>
                            <th className="text-left border-b w-[230px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-2 py-2 border-b text-[15px] text-wrap">{event.name}</td>
                                    <td className="px-2 py-2 border-b text-[15px] text-wrap">{event.location} {event.address}</td>
                                    <td className="px-2 py-2 border-b text-[12px] text-center">{new Date(event.date_start).toLocaleDateString()} <br /> {event.date_end ? new Date(event.date_end).toLocaleDateString() : 'selesai'}</td>
                                    <td className="px-2 py-2 border-b text-[12px] text-wrap">{event.time}</td>
                                    <td className="px-2 py-2 border-b text-[15px] text-wrap">{event.capacity}( {event.remaining_capacity} )</td>
                                    <td className="px-2 py-2 border-b text-[15px] text-wrap">{event.price}</td>
                                    <td className="px-2 py-2 border-b text-[15px] text-wrap">{event.status}</td>
                                    <td className="px-2 py-2 border-b text-[15px] text-wrap">
                                        {event.photo ? (
                                            <img
                                                src={`http://localhost:5000${event.photo}`}
                                                className="hover:w-[260px] duration-300"
                                                onError={(e) => {
                                                    console.log(`Image not found for event: ${event.id}, setting to default.`);
                                                    (e.target as HTMLImageElement).src = 'https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg';
                                                }}
                                            />
                                        ) : (
                                            <img src="https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg" alt="" />
                                        )}</td>
                                    <td className="px-2 py-2 border-b text-[12px] text-wrap">
                                        <button
                                            onClick={() => handleViewRegistrants(event.id)}
                                            className="bg-blue-500 text-white w-[50px] h-[40px] me-2 rounded hover:bg-blue-700"
                                        >
                                            View
                                        </button>
                                        <button onClick={() => router.push(`/admin/event/update?id=${event.id}`)}
                                            className='bg-yellow-500 text-white w-[50px] h-[40px] me-2 rounded hover:bg-yellow-700'>
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(event.id)}
                                            className='bg-red-500 text-white w-[50px] h-[40px] me-2 rounded hover:bg-red-700'>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-3 border-b text-center">
                                    No events found.
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
        </div>
    );
};

export default AdminDashboard;
