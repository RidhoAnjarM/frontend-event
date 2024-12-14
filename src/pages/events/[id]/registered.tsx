import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Registrant, EventDetail } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Registered = () => {
    const router = useRouter();
    const { id } = router.query;
    const [eventDetails, setEventDetails] = useState<EventDetail | null>(null);

    useEffect(() => {
        if (id) {
            const fetchEventDetails = async () => {
                try {
                    const response = await axios.get(`${API_URL}/events/${id}/registered`);
                    setEventDetails(response.data);
                } catch (error) {
                    console.error('Error fetching event details:', error);
                }
            };
            fetchEventDetails();
        }
    }, [id]);

    if (!eventDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-center">Pendaftar di - {eventDetails.event_name}</h1>
            <button onClick={() => router.push('/admin/dashboard')} className='w-[50px] h-[50px] rounded-full z-10 top-0 mt-[10px] mb-[10px] bg-opacity-50 flex justify-center items-center bg-black hover:bg-opacity-25 duration-300 ease-in-out '><img src="../../icons/back.png" alt="" /></button>
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left px-6 py-3 border-b">Username</th>
                        <th className="text-left px-6 py-3 border-b">Nama</th>
                        <th className="text-left px-6 py-3 border-b">Email</th>
                        <th className="text-left px-6 py-3 border-b">No Telepon</th>
                        <th className="text-left px-6 py-3 border-b">Pekerjaan/Organisai</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(eventDetails.registrants) && eventDetails.registrants.length > 0 ? (
                        eventDetails.registrants.map((registrant, index) => (
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
                            <td colSpan={5} className="px-6 py-3 border-b text-center">
                                No registrants found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};


export default Registered;
