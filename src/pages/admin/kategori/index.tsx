import { useEffect, useState } from 'react';
import { Category } from '@/types/types';
import axios from 'axios';
import Navmin from '@/components/Navmin';
import Modal from '@/components/modal';
import Alert from '@/components/Alert';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Kategori = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/categories`);
            const sortedCategories = response.data.sort((a: Category, b: Category) => b.id - a.id);
            setCategories(sortedCategories);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            setAlert({ type: 'error', message: 'Nama kategori tidak boleh kosong' });
            setTimeout(() => { setAlert(null); }, 2000);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/categories`, {
                name: newCategoryName,
            });

            const newCategory = response.data;
            setCategories([newCategory, ...categories]);

            setNewCategoryName("");
            setIsModalOpen(false);
            setAlert({ type: 'success', message: 'Kategori berhasil ditambahkan' });

            setTimeout(() => { setAlert(null); }, 2000);
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            setAlert({ type: 'error', message: 'Gagal menambahkan kategori' });
            setTimeout(() => { setAlert(null); }, 2000);
        }
    };

    const handleUpdateCategory = async () => {
        if (!selectedCategory) return;

        try {
            const response = await axios.put(`${API_URL}/categories/${selectedCategory.id}`, {
                name: newCategoryName,
            });

            const updatedCategory = response.data;

            setCategories((prevCategories) => {
                const filteredCategories = prevCategories.filter(
                    (category) => category.id !== updatedCategory.id
                );
                return [updatedCategory, ...filteredCategories];
            });

            setNewCategoryName("");
            setIsUpdateModalOpen(false);
            setAlert({ type: 'success', message: 'Kategori berhasil diperbarui' });

            setTimeout(() => { setAlert(null); }, 2000);
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
            setAlert({ type: 'error', message: 'Gagal memperbarui kategori' });
            setTimeout(() => { setAlert(null); }, 2000);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            await axios.delete(`${API_URL}/categories/${selectedCategory.id}`);

            setIsDeleteModalOpen(false);
            setAlert({ type: 'success', message: 'Kategori berhasil dihapus' });

            setTimeout(() => { setAlert(null); }, 2000);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            setAlert({ type: 'error', message: 'Gagal menghapus kategori' });
            setTimeout(() => { setAlert(null); }, 2000);
        }
    };

    const openUpdateModal = (category: Category) => {
        setSelectedCategory(category);
        setNewCategoryName(category.name);
        setIsUpdateModalOpen(true);
    };

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    return (
        <div>
            <Navmin />
            <div className="w-full ps-[170px]">
                <div className="w-full flex justify-between pe-8 pt-16">
                    <h1 className="text-[28px] mb-4 font-russo">Kategori</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mb-4 px-4 py-2 bg-custom-navy text-white rounded hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                    >
                        Tambah Kategori
                    </button>
                </div>
                {alert && (
                    <Alert
                        type={alert.type as any}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden me-8">
                        <table className="min-w-full bg-white border border-gray-200 font-sans rounded-lg overflow-hidden shadow-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-all duration-200">
                                            <td className="px-4 py-3 text-[15px] text-gray-700">
                                                {category.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex w-full gap-3">
                                                    <button
                                                        onClick={() => openUpdateModal(category)}
                                                        className="bg-yellow-500 text-white w-[40px] h-[40px] justify-center rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center text-sm"
                                                    >
                                                        <img src="../icons/edit.svg" alt="" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(category)}
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
                                        <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                                            Tidak ada kategori yang tersedia.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Tambah Kategori</h2>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nama kategori"
                    className="w-full px-4 py-2 border rounded mb-4"
                    required
                />
                <button
                    onClick={handleAddCategory}
                    className="mb-4 px-4 py-2 bg-custom-navy text-white rounded hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                >
                    Simpan
                </button>
            </Modal>

            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Update Kategori</h2>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nama kategori"
                    className="w-full px-4 py-2 border rounded mb-4"
                />
                <button
                    onClick={handleUpdateCategory}
                    className="mb-4 px-4 py-2 bg-custom-navy text-white rounded hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                >
                    Update
                </button>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
                <p>Apakah Anda yakin ingin menghapus kategori ini?</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDeleteCategory}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Hapus
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Kategori;
