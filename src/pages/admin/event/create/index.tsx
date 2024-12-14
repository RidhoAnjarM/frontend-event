import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Category, Location } from '@/types/types';
import Modal from '@/components/modal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CreateEventForm = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [datestart, setDateStart] = useState('');
    const [dateend, setDateEnd] = useState('');
    const [capacity, setCapacity] = useState<number | ''>('');
    const [category, setCategory] = useState<string | number>('');
    const [location, setLocation] = useState<string | number>('');
    const [address, setAddress] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [price, setPrice] = useState<string>('');
    const [mode, setMode] = useState<string>('offline');
    const [link, setLink] = useState('');
    const [benefits, setBenefits] = useState('');
    const [sessions, setSessions] = useState([
        { date: '', time: '', speaker: '', location: '' },
    ]);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [fileName, setFileName] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/categories`);
                setCategories(response.data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${API_URL}/location`);
                setLocations(response.data);
            } catch (err) {
                console.error('Failed to fetch locations:', err);
            }
        };

        fetchCategories();
        fetchLocations();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const finalEndTime = endTime || 'Selesai';
        const timeRange = `${startTime} - ${finalEndTime}`;
        console.log('Waktu:', timeRange);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('datestart', datestart);
        if (dateend) formData.append('dateend', dateend);
        formData.append('time', timeRange);
        formData.append('capacity', capacity.toString());
        formData.append('category_id', String(category));
        formData.append('location_id', mode === 'offline' ? String(location) : '');
        formData.append('address', mode === 'offline' ? address : '');
        formData.append('price', price ? price.toString() : '');
        formData.append('mode', mode);
        if (mode === 'online') formData.append('link', link);
        formData.append('benefits', benefits);
        if (photo) {
            formData.append('photo', photo);
        } else {
            formData.append('photo', new Blob([], { type: 'image/jpeg' }));
        }

        sessions.forEach((session, index) => {
            formData.append(`sessions[${index}][date]`, session.date);
            formData.append(`sessions[${index}][time]`, session.time);
            formData.append(`sessions[${index}][speaker]`, session.speaker);
            formData.append(`sessions[${index}][location]`, session.location);
        });

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in.');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                }, 2000);
                return;
            }

            await axios.post(`${API_URL}/event`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess('Event created successfully!');
            setError(null);
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                router.push('/admin/dashboard');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError('Failed to create event.');
            setSuccess(null);
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 2000);
        }

    };

    const handleFileChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
        if (!e || !e.target.files || !e.target.files[0]) {
            setPhoto(null);
            setError(null);
            return;
        }

        const file = e.target.files[0];
        const fileType = file.type;
        if (!fileType.startsWith('image/')) {
            setError('Please upload an image file.');
            return;
        }
        setPhoto(file);
    };

    const handleSessionChange = (index: number, field: keyof typeof sessions[0], value: string) => {
        const updatedSessions = [...sessions];
        updatedSessions[index][field] = value;
        setSessions(updatedSessions);
    };

    const addSession = () => {
        setSessions([...sessions, { date: '', time: '', speaker: '', location: '' }]);
    };

    const removeSession = (index: number) => {
        const updatedSessions = sessions.filter((_, i) => i !== index);
        setSessions(updatedSessions);
    };

    const validateForm = () => {
        if (!name || !description || !datestart || !capacity || !mode || !category) {
            setError('Beberapa kolom belum diisi!.');
            return false;
        }

        if (mode === 'online' && !link) {
            setError('Link harus diisi jika mode online.');
            return false;
        }

        if (mode === 'offline' && (!location || !address)) {
            setError('Lokasi dan Alamat Lengkap wajib diisi jika mode offline.');
            return false;
        }

        return true;
    };

    const clearFileInput = () => {
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
        handleFileChange();
    };

    const formatRupiah = (value: string): string => {
        const numberString = value.replace(/\D/g, '');
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        if (value === '') {
            setPrice('');
            return;
        }

        if (value.startsWith('Rp.')) {
            value = value.slice(4);
        }

        const formattedValue = value ? 'Rp. ' + formatRupiah(value) : '';
        setPrice(formattedValue);
    };


    return (
        <div className="container w-full mt-10">
            <h1 className="text-2xl font-bold mb-5 text-center">Buat Acara Baru</h1>
            <button onClick={() => router.push('/admin/dashboard')} className='w-[50px] h-[50px] ms-[120px] rounded-full absolute z-10 top-0 mt-[70px] bg-opacity-50 flex justify-center items-center bg-black hover:bg-opacity-25 duration-300 ease-in-out '><img src="../../icons/back.png" alt="" /></button>
            <form onSubmit={handleSubmit} className="w-full flex justify-center mb-10">
                <div className="w-[650px]">
                    <div className="w-full h-[46px] relative flex mb-5">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="peer w-full h-[46px] rounded-[5px] text-black outline-none px-5 font-sans"
                        />
                        <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-150"
                            form='name'>
                            Nama Acara
                        </label>
                    </div>

                    <div className="w-full h-[80px] relative flex mb-5">
                        <input
                            id='deskripsi'
                            type='text'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="peer w-full h-[80px] rounded-[5px] text-black outline-none px-5 font-sans"
                            required
                        />
                        <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-150"
                            form='deskripsi'>
                            Deskripsi
                        </label>
                    </div>

                    <div className="w-full relative flex justify-between mt-7">
                        <div className="flex gap-4">
                            <div className="relative">
                                <input
                                    id='dates'
                                    type="date"
                                    value={datestart}
                                    onChange={(e) => setDateStart(e.target.value)}
                                    className="peer h-[46px] w-[150px] rounded-[5px] text-black outline-none px-5 font-sans text-[13px]"
                                />
                                <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-2 peer-valid:left-3 peer-valid:text-[13px] peer-valid:text-black duration-150"
                                    form='dates'>
                                    Tanggal Mulai
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    id='dateend'
                                    type="date"
                                    value={dateend}
                                    onChange={(e) => setDateEnd(e.target.value)}
                                    className="peer h-[46px] w-[150px] rounded-[5px] text-black outline-none px-5 font-sans text-[13px]"
                                />
                                <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-2 peer-valid:left-3 peer-valid:text-[13px] peer-valid:text-black duration-150"
                                    form='dateend'>
                                    Tanggal selesai
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="peer h-[46px] w-[150px] rounded-[5px] text-black outline-none px-5 font-sans text-[13px]"
                                />
                                <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-2 peer-valid:left-3 peer-valid:text-[13px] peer-valid:text-black duration-150"
                                    form='dateend'>
                                    Waktu Mulai
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="peer h-[46px] w-[150px] rounded-[5px] text-black outline-none px-5 font-sans text-[13px] "
                                />
                                <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-2 peer-valid:left-3 peer-valid:text-[13px] peer-valid:text-black duration-150"
                                    form='dateend'>
                                    Waktu Selesai
                                </label>
                            </div>
                        </div>
                    </div>
                    <p className='font-sans text-[12px] text-center'>Tanggal & Waktu selesai opsional</p>

                    <div className="w-full relative flex mb-5 mt-5">
                        <div className="relative">
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className="peer h-[46px] w-[200px] rounded-[5px] text-black outline-none px-5 me-4 font-sans"
                                required
                            >
                                <option value="offline">Offline</option>
                                <option value="online">Online</option>
                            </select>
                            <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-2 peer-valid:left-3 peer-valid:text-[13px] peer-valid:text-black duration-150"
                            >
                                Mode
                            </label>
                        </div>
                        {mode === 'online' && (
                            <div className="relative">
                                <input
                                    type="text"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="peer h-[46px] w-[433px] rounded-[5px] text-black outline-none px-5 font-sans"
                                    required
                                />
                                <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-150"
                                >
                                    Link
                                </label>
                            </div>
                        )}
                    </div>

                    {mode === 'offline' && (
                        <div className='w-full relative flex mb-5'>
                            <div className="relative">
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="peer h-[46px] w-[200px] rounded-[5px] text-black outline-none px-5 me-4 font-sans"
                                >
                                    <option value="">. . .</option>
                                    {locations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>
                                            {loc.city}
                                        </option>
                                    ))}
                                </select>
                                <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-150"
                                >
                                    Pilih Lokasi
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="peer h-[46px] w-[433px] rounded-[5px] text-black outline-none px-5 font-sans"
                                    required
                                />
                                <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-150"
                                >
                                    Alamat Lengkap
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="w-full relative flex mb-5 justify-between">
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="peer h-[46px] w-[300px] rounded-[5px] text-black outline-none px-5 me-4 font-sans"
                            >
                                <option value="">. . .</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-150"
                            >
                                Pilih Kategori
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(Math.max(0, Number(e.target.value)))}
                                className="peer h-[46px] w-[330px] rounded-[5px] text-black outline-none px-5 font-sans"
                                required
                                min="0"
                            />
                            <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-150"
                            >
                                Kapasitas
                            </label>
                        </div>
                    </div>

                    <div className="w-full h-[46px] relative flex mb-5 mt-7">
                        <input
                            type="text"
                            value={price}
                            onChange={handlePriceChange}
                            className="peer w-full h-[46px] rounded-[5px] text-black outline-none px-5 font-sans"
                        />
                        <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-2 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-150"
                        >
                            Harga <span className='text-[12px] font-sans'>(Jika gratis kosongkan)</span>
                        </label>
                    </div>

                    <div className="w-full h-[80px] relative flex mb-5">
                        <input
                            type='text'
                            value={benefits}
                            onChange={(e) => setBenefits(e.target.value)}
                            className="peer w-full h-[80px] rounded-[5px] text-black outline-none px-5 font-sans"
                            required
                        />
                        <label className="absolute text-black top-1/2 translate-y-[-50%] left-4 px-2 peer-focus:-top-2 peer-focus:left-3 font-light peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-150"
                        >
                            Keuntungan Acara
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative">
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    handleFileChange(e);
                                    setFileName(e.target.files?.[0]?.name || '');
                                }}
                                className="absolute w-full h-full opacity-0 cursor-pointer rounded-[5px]"
                            />
                            <div className="flex items-center justify-between w-full h-[46px] px-4 border rounded-[5px] bg-white hover:bg-gray-100 transition duration-200 cursor-pointer">
                                <span className="text-black text-sm">
                                    {fileName || 'Pilih file gambar'}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 text-gray-500"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 16.5V3m0 0L8.25 6.75M12 3l3.75 3.75M8.25 20.25h7.5"
                                    />
                                </svg>
                            </div>
                        </div>
                        {fileName && (
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFileName('');
                                        clearFileInput();
                                    }}
                                    className="text-red-600 text-sm font-medium hover:underline"
                                >
                                    Batalkan
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-7 ms-14">Tambah Sesi Acara</div>
                    <div className="grid grid-cols-2">
                        {sessions.map((session, index) => (
                            <div key={index} className="mb-4 border rounded-[5px] w-[300px] p-3">
                                <input
                                    type="date"
                                    placeholder="Session Date"
                                    value={session.date}
                                    onChange={(e) => handleSessionChange(index, 'date', e.target.value)}
                                    className="peer h-[46px] w-full rounded-[5px] text-black outline-none px-5 font-sans text-[13px]"
                                />
                                <input
                                    type="time"
                                    placeholder="Session Time"
                                    value={session.time}
                                    onChange={(e) => handleSessionChange(index, 'time', e.target.value)}
                                    className="peer h-[46px] w-full rounded-[5px] text-black outline-none px-5 font-sans text-[13px] mt-4"
                                />
                                <input
                                    type="text"
                                    placeholder="Sesi Pembicara"
                                    value={session.speaker}
                                    onChange={(e) => handleSessionChange(index, 'speaker', e.target.value)}
                                    className="peer h-[46px] w-full rounded-[5px] text-black outline-none px-5 font-sans text-[13px] mt-4"
                                />
                                <input
                                    type="text"
                                    placeholder="Lokasi Sesi"
                                    value={session.location}
                                    onChange={(e) => handleSessionChange(index, 'location', e.target.value)}
                                    className="peer h-[46px] w-full rounded-[5px] text-black outline-none px-5 font-sans text-[13px] mt-4"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSession(index)}
                                    className="text-red-500 text-center mt-2 text-[15px] ms-16"
                                >
                                    Hapus sesi acara
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addSession}
                        className="w-[90px] h-[40px] bg-custom-navy text-[12px] text-white font-sans rounded-[5px] hover:bg-cyan-800 ms-3 mb-5"
                    >
                        Tambah sesi
                    </button>
                    <button
                        type="submit"
                        className="bg-custom-navy text-white p-2 rounded w-full border border-custom-navy hover:bg-white hover:text-custom-navy duration-300 ease-in-out"
                    >
                        Buat Acara
                    </button>
                </div>
            </form>
            {showModal && (
                <Modal isOpen={true} onClose={() => setShowModal(false)}>
                    <div className="p-4">
                        {success && <p className="text-green-500 font-sans text-center text-xl">{success}</p>}
                        {error && <p className="text-red-500 font-sans text-center text-xl">{error}</p>}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CreateEventForm;
