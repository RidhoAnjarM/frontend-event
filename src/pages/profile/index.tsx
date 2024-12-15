import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { RegisteredEvent, EventCardProps, Rating, AlertType } from '@/types/types';
import Footer from '@/components/footer';
import Modal from '@/components/modal';
import Alert from '@/components/Alert';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Profile: React.FC<EventCardProps> = () => {
    const router = useRouter();
    const [events, setEvents] = useState<RegisteredEvent[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<RegisteredEvent | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: '',
        password: '',
        newPassword: ''
    });
    const [userId, setUserId] = useState<string>('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [currentRatingId, setCurrentRatingId] = useState<number | null>(null);
    const [eventRatings, setEventRatings] = useState<{[key: number]: Rating}>({});
    const [alert, setAlert] = useState<{
        show: boolean;
        type: AlertType;
        message: string;
    }>({
        show: false,
        type: 'info',
        message: ''
    });

    const getDayOfWeek = (dateString: string) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    const validateForm = () => {
        if (editForm.username.trim() === '') {
            showAlert('error', 'Username tidak boleh kosong');
            return false;
        }
        
        if (editForm.newPassword) {
            if (editForm.newPassword.length < 6) {
                showAlert('error', 'Password baru minimal 6 karakter');
                return false;
            }
            if (!editForm.password) {
                showAlert('error', 'Masukkan password lama untuk verifikasi');
                return false;
            }
        }
        
        return true;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Ambil data profile dulu
                const profileResponse = await axios.get(`${API_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                console.log("Profile response:", profileResponse.data);
                console.log("User ID from profile:", profileResponse.data.id);
                
                if (!profileResponse.data.id) {
                    console.error("ID tidak ditemukan dalam response profile");
                }
                
                // Set userId dari response profile
                setUserId(profileResponse.data.id);
                setUsername(profileResponse.data.username);
                
                // Log state setelah di-set
                console.log("userId after set:", profileResponse.data.id);
                
                // Kemudian ambil events yang telah didaftar
                const eventsResponse = await axios.get(`${API_URL}/events/registered`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setEvents(eventsResponse.data.registered_events || []);
                setEditForm(prev => ({...prev, username: profileResponse.data.username || ''}));
                
            } catch (error: any) {
                console.error('Error fetching profile:', error);
                console.error('Error response:', error.response);
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

    const showAlert = (type: AlertType, message: string) => {
        setAlert({
            show: true,
            type,
            message
        });
        setTimeout(() => {
            setAlert(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;
        const token = localStorage.getItem('token');
        
        if (editForm.newPassword && !editForm.password) {
            showAlert('error', 'Masukkan password lama jika ingin mengubah password');
            return;
        }

        const updateData = {
            username: editForm.username,
            ...(editForm.newPassword && {
                password: editForm.password,
                newPassword: editForm.newPassword
            })
        };
        
        try {
            const response = await axios.put(`${API_URL}/user/${userId}`, updateData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                setUsername(editForm.username);
                setIsEditing(false);
                
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                userData.username = editForm.username;
                localStorage.setItem('user', JSON.stringify(userData));
                
                setEditForm(prev => ({
                    ...prev,
                    password: '',
                    newPassword: ''
                }));
                
                if (editForm.newPassword) {
                    showAlert('success', 'Password berhasil diubah. Silakan login kembali.');
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        router.push('/login');
                    }, 2000);
                } else {
                    showAlert('success', 'Profil berhasil diperbarui!');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Gagal memperbarui profil';
                showAlert('error', errorMessage);
            }
        }
    };

    const handleEventClick = async (event: RegisteredEvent) => {
        try {
            const response = await axios.get(`${API_URL}/events/${event.id}/ratings`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            console.log("Rating response:", response.data);
            
            const ratings = Array.isArray(response.data) ? response.data : response.data.ratings;
            
            const userRating = ratings.find((r: Rating) => r.user_id === parseInt(userId));
            if (userRating) {
                console.log("Found user rating:", userRating);
                setSelectedRating(userRating.rating);
                setCurrentRatingId(userRating.id);
            } else {
                setSelectedRating(0);
                setCurrentRatingId(null);
            }
            
            setSelectedEvent(event);
            setShowRatingModal(true);
        } catch (error) {
            console.error('Error fetching ratings:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error response:', error.response?.data);
                showAlert('error', 'Gagal mengambil data rating');
            }
        }
    };

    const handleRatingSubmit = async () => {
        try {
            if (currentRatingId) {
                console.log("Updating rating with ID:", currentRatingId);
                await axios.put(`${API_URL}/rating/${currentRatingId}`, {
                    rating: selectedRating,
                    event_id: selectedEvent?.id
                }, {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                showAlert('success', 'Rating berhasil diperbarui!');
            } else {
                console.log("Creating new rating for event:", selectedEvent?.id);
                await axios.post(`${API_URL}/rating`, {
                    event_id: selectedEvent?.id,
                    rating: selectedRating
                }, {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                showAlert('success', 'Rating berhasil ditambahkan!');
            }
            
            setShowRatingModal(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error submitting rating:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error response:', error.response?.data);
                showAlert('error', error.response?.data?.error || 'Gagal memberikan rating');
            }
        }
    };

    const handleDeleteRating = async () => {
        if (!currentRatingId) {
            showAlert('error', 'Rating ID tidak ditemukan');
            return;
        }
        
        try {
            console.log("Deleting rating with ID:", currentRatingId);
            console.log("Event ID:", selectedEvent?.id);
            
            await axios.delete(`${API_URL}/rating/${currentRatingId}`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                data: { 
                    event_id: selectedEvent?.id
                }
            });
            
            showAlert('success', 'Rating berhasil dihapus!');
            setShowRatingModal(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error deleting rating:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error response:', error.response?.data);
                showAlert('error', error.response?.data?.error || 'Gagal menghapus rating');
            }
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
            {alert.show && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                />
            )}
            <div className="flex justify-between w-full px-[120px] items-center">
                <button onClick={() => router.push('/')} className='w-[50px] h-[50px] rounded-full z-10  mt-[30px] flex justify-center items-center hover:bg-black hover:bg-opacity-25 duration-300 ease-in-out'>
                    <img src="../icons/back (1).png" alt="" />
                </button>
                <h1 className='text-center text-[20px] mb-10 mt-5'>Profil</h1>
                <div className=""></div>
            </div>
            <div className="w-full px-[120px] mb-10">
                <h3 className='mb-10 text-[26px] text-center'>
                    {username} 
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="ml-2 text-sm text-custom-purple-2-100"
                    >
                        {isEditing ? 'Batal' : 'Edit Profil'}
                    </button>
                </h3>

                {isEditing && (
                    <div className="max-w-md mx-auto mb-8 p-4 border rounded-lg">
                        <div className="mb-4">
                            <label className="block mb-2">Username Baru:</label>
                            <input 
                                type="text"
                                value={editForm.username}
                                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                className="w-full p-2 border rounded"
                                required
                                minLength={3}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Password Lama (Jika ingin mengubah password):</label>
                            <input 
                                type="password"
                                value={editForm.password}
                                onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Password Baru (Minimal 6 karakter):</label>
                            <input 
                                type="password"
                                value={editForm.newPassword}
                                onChange={(e) => setEditForm({...editForm, newPassword: e.target.value})}
                                className="w-full p-2 border rounded"
                                minLength={6}
                            />
                            <small className="text-gray-500">Kosongkan kedua field password jika hanya ingin mengubah username</small>
                        </div>
                        <button 
                            onClick={handleUpdate}
                            className="w-full bg-custom-purple-2-100 text-white py-2 rounded hover:bg-opacity-90"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                )}

                <Modal
                    isOpen={showRatingModal}
                    onClose={() => setShowRatingModal(false)}
                >
                    <div className="p-8 justify-center bg-white rounded-xl">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-custom-purple-2-100 mb-1">
                                {selectedEvent?.name}
                            </h3>
                            <p className="text-sm text-gray-600">Berikan rating untuk event ini</p>
                        </div>

                        <div className="flex justify-center space-x-2 mb-4">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setSelectedRating(rating)}
                                    className={`transform transition-all duration-200 hover:scale-110 ${
                                        rating <= selectedRating 
                                            ? 'text-yellow-400 hover:text-yellow-500' 
                                            : 'text-gray-300 hover:text-gray-400'
                                    }`}
                                >
                                    <svg 
                                        className="w-10 h-10" 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-base font-medium text-custom-purple-2-100">
                                {selectedRating === 0 && "Pilih rating"}
                                {selectedRating === 1 && "Kurang Bagus"}
                                {selectedRating === 2 && "Cukup"}
                                {selectedRating === 3 && "Bagus"}
                                {selectedRating === 4 && "Sangat Bagus"}
                                {selectedRating === 5 && "Luar Biasa!"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleRatingSubmit}
                                className="w-full py-2 rounded-lg bg-custom-purple-2-100 text-white hover:bg-opacity-90 transition-colors duration-200 text-sm"
                            >
                                {currentRatingId ? 'Update Rating' : 'Beri Rating'}
                            </button>
                            
                            {currentRatingId && (
                                <button
                                    onClick={handleDeleteRating}
                                    className="w-full py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 text-sm"
                                >
                                    Hapus Rating
                                </button>
                            )}
                            
                            <button
                                onClick={() => setShowRatingModal(false)}
                                className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
                            >
                                Batal
                            </button>
                        </div>

                        {currentRatingId && (
                            <div className="mt-3 text-center text-xs text-gray-500">
                                Rating saat ini: {selectedRating} bintang
                            </div>
                        )}
                    </div>
                </Modal>

                <div className='grid grid-cols-4 gap-7'>
                    {Array.isArray(events) && events.length > 0 ? (
                        events.map((event: RegisteredEvent) => (
                            <div key={event.id} className="cursor-pointer" onClick={() => handleEventClick(event)}>
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

           
        </div>
    );
};

export default Profile;
