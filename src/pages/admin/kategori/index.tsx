import { useEffect, useState } from 'react';
import { Category } from '@/types/types';
import axios from 'axios';
import Navmin from '@/components/Navmin';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Kategori = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/categories`);
                console.log('Categories:', response.data);
                setCategories(response.data);
                setIsLoading(false); 
            } catch (error) {
                console.error('Error fetching Categories:', error);
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div>
            <Navmin />
            <div className="w-full ps-[170px]">
                <h1 className="text-2xl font-semibold mb-4">Kategori</h1>
                <button>Tambah </button>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table className='w-[450px]'>
                        <thead>
                            <tr>
                                <th className='w-[50px]'>ID</th>
                                <th className='w-[200px]'>Nama</th>
                                <th className='w-[200px]'>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category.id} className='bg-white'>
                                        <td>{category.id}</td>
                                        <td>{category.name}</td>
                                        <td></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>Tidak ada kategori yang tersedia.</td>
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
