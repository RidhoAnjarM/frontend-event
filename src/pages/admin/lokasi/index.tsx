import { useEffect, useState } from 'react';
import { Location } from '@/types/types';
import axios from 'axios';
import Navmin from '@/components/Navmin';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Kategori = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${API_URL}/location`);
                console.log('Locations:', response.data);
                setLocations(response.data);
                setIsLoading(false); 
            } catch (error) {
                console.error('Error fetching Categories:', error);
                setIsLoading(false);
            }
        };
        fetchLocations();
    }, []);

    return (
        <div>
            <Navmin />
            <div className="w-full ps-[170px]">
                <h1 className="text-2xl font-semibold mb-4">Lokasi</h1>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table className='w-[450px]'>
                        <thead>
                            <tr>
                                <th className='w-[50px]'>ID</th>
                                <th className='w-[200px]'>Kota</th>
                                <th className='w-[200px]'>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.length > 0 ? (
                                locations.map((location) => (
                                    <tr key={location.id} className='bg-white'>
                                        <td>{location.id}</td>
                                        <td>{location.city}</td>
                                        <td></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>Tidak ada Lokasi yang tersedia.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Kategori;
