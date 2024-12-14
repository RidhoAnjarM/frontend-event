import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { RegisteredEvent, EventCardProps } from '@/types/types';
import Footer from '@/components/footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Profile: React.FC<EventCardProps> = () => {
    const router = useRouter();
    const [events, setEvents] = useState<RegisteredEvent[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<RegisteredEvent | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [existingRating, setExistingRating] = useState<{ id: number; rating: number } | null>(null);

    const getDayOfWeek = (dateString: string) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/events/registered`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setEvents(response.data.registered_events || []);
                setUsername(response.data.username || null);
            } catch (error: any) {
                console.error('Error fetching profile:', error);
                setEvents([]);
                setUsername(null);

                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const fetchRating = async (eventId: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get(`${API_URL}/events/${eventId}/ratings`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userRating = response.data.ratings.find((rating: any) => rating.user_id === response.data.user_id);
            if (userRating) {
                setExistingRating({ id: userRating.id, rating: userRating.rating });
                setRating(userRating.rating);
            } else {
                setExistingRating(null);
                setRating(0);
            }
        } catch (error) {
            console.error('Error fetching rating:', error);
        }
    };

    const submitRating = async () => {
        if (!selectedEvent) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Anda harus login untuk memberikan rating.');
            return;
        }

        try {
            if (existingRating) {
                const response = await axios.put(
                    `${API_URL}/rating/${existingRating.id}`,
                    { event_id: selectedEvent.id, rating },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert(response.data.message);
            } else {
                const response = await axios.post(
                    `${API_URL}/rating`,
                    { event_id: selectedEvent.id, rating },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert(response.data.message);
            }
            fetchRating(selectedEvent.id);
        } catch (error: any) {
            console.error('Error submitting rating:', error);
            alert('Gagal mengirimkan rating.');
        }
    };

    const deleteRating = async () => {
        if (!existingRating) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Anda harus login untuk menghapus rating.');
            return;
        }

        try {
            const response = await axios.delete(`${API_URL}/rating/${existingRating.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(response.data.message);
            setExistingRating(null);
            setRating(0);
        } catch (error) {
            console.error('Error deleting rating:', error);
            alert('Gagal menghapus rating.');
        }
    };

    if (loading) {
        return <div className='w-full mt-[400px] justify-center flex items-center'>
            <div className="flex flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
                <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-custom-purple-light animate-bounce [animation-delay:.7s]"></div>
            </div>
        </div>;
    }

    return (
        <div>
            <div className="flex justify-between w-full px-[120px] items-center">
                <button onClick={() => router.push('/')} className='w-[50px] h-[50px] rounded-full z-10  mt-[30px] flex justify-center items-center hover:bg-black hover:bg-opacity-25 duration-300 ease-in-out'>
                    <img src="../icons/back (1).png" alt="" />
                </button>
                <h1 className='text-center text-[20px] mb-10 mt-5'>Profil</h1>
                <div className=""></div>
            </div>
            <div className="w-full px-[120px] mb-10">
                <h3 className='mb-10 text-[26px] text-center'>Event yang Diikuti: {username}</h3>
                <div className='grid grid-cols-4 gap-7'>
                    {Array.isArray(events) && events.length > 0 ? (
                        events.map((event: RegisteredEvent) => (
                            <div key={event.id} className="cursor-pointer" onClick={() => {
                                setSelectedEvent(event);
                                fetchRating(event.id);
                            }}>
                                <div className="w-[300px] h-[300px] flex flex-col border-[2px] border-custom-purple-2-100 overflow-hidden rounded-[10px] bg-white">
                                    <div className="w-full h-[150px] flex justify-center items-center overflow-hidden border-b border-custom-purple-2-100">
                                        {event.photo ? (
                                            <img
                                                src={`http://localhost:5000${event.photo}`}
                                                onError={(e) => {
                                                    console.log(`Image not found for event: ${event.id}, setting to default.`);
                                                    (e.target as HTMLImageElement).src =
                                                        'https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg';
                                                }}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src="https://i.pinimg.com/736x/01/7c/44/017c44c97a38c1c4999681e28c39271d.jpg"
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex-grow px-[37px]">
                                        <h2 className="text-black text-[16px] text-center mt-[10px]">{event.name}</h2>
                                        <p className="text-gray-600 text-[13px] mt-[8px]">
                                            {getDayOfWeek(event.date)}, {new Date(event.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-custom-purple-2-100 text-[13px] mt-[8px]">
                                            {event.time}
                                        </p>
                                        <p>{event.status}</p>
                                        <div className="flex items-center"><img src="../icons/bintang.svg" alt="" />{event.rating} ({event.uniqueraters})</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-center col-span-4 h-[200px]'>Anda belum mendaftar ke event apa pun.</p>
                    )}
                </div>
            </div>
            <Footer />

            {selectedEvent && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-xl mb-4 text-center">Berikan Rating untuk <br/> {selectedEvent.name}</h2>
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full border p-2 rounded mb-4"
                        >
                            <option value={0}>Pilih Rating</option>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button onClick={submitRating} className="bg-blue-500 text-white px-4 py-2 rounded">Kirim</button>
                            {existingRating && (
                                <button onClick={deleteRating} className="bg-red-500 text-white px-4 py-2 rounded">Hapus</button>
                            )}
                            <button onClick={() => setSelectedEvent(null)} className="bg-gray-300 px-4 py-2 rounded">Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
