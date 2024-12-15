import { useEffect, useState } from 'react';
import { Location } from '@/types/types';
import axios from 'axios';
import Navmin from '@/components/Navmin';
import Modal from '@/components/modal';
import Alert from '@/components/Alert';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Lokasi = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLocationName, setNewLocationName] = useState("");
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

    const fetchLocations = async () => {
        try {
            const response = await axios.get(`${API_URL}/location`);
            const sortedLocations = response.data.sort((a: Location, b: Location) => b.id - a.id);
            setLocations(sortedLocations);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching Locations:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleAddLocation = async () => {
        if (!newLocationName.trim()) {
            setAlert({ type: 'error', message: 'Nama Lokasi tidak boleh kosong' });
            setTimeout(() => { setAlert(null); }, 2000);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/location`, {
                city: newLocationName,
            });

            const newLocation = response.data;
            setLocations([newLocation, ...locations]);

            setNewLocationName("");
            setIsModalOpen(false);
            setAlert({ type: 'success', message: 'Lokasi berhasil ditambahkan' });

            setTimeout(() => { setAlert(null); }, 2000);
            fetchLocations();
        } catch (error) {
            console.error('Error adding Location:', error);
            setAlert({ type: 'error', message: 'Gagal menambahkan Lokasi' });
            setTimeout(() => { setAlert(null); }, 2000);
        }
    };

    const handleUpdateLocation = async () => {
        if (!selectedLocation) return;

        try {
            const response = await axios.put(`${API_URL}/location/${selectedLocation.id}`, {
                city: newLocationName,
            });

            setNewLocationName("");
            setIsUpdateModalOpen(false);
            setAlert({ type: 'success', message: 'Lokasi berhasil diperbarui' });

            setTimeout(() => { setAlert(null); }, 2000);
            fetchLocations();
        } catch (error) {
            console.error('Error updating category:', error);
            setAlert({ type: 'error', message: 'Gagal memperbarui Lokasi' });
            setTimeout(() => { setAlert(null); }, 2000);
        }
    };

    const handleDeleteLocation = async () => {
        if (!selectedLocation) return;

        try {
            await axios.delete(`${API_URL}/location/${selectedLocation.id}`);

            setIsDeleteModalOpen(false);
            setAlert({ type: 'success', message: 'Lokasi berhasil dihapus' });

            setTimeout(() => { setAlert(null); }, 2000);
            fetchLocations();
        } catch (error) {
            console.error('Error deleting category:', error);
            setAlert({ type: 'error', message: 'Gagal menghapus Lokasi' });
            setTimeout(() => { setAlert(null); }, 2000);
        }
    };

    const openUpdateModal = (location: Location) => {
        setSelectedLocation(location);
        setNewLocationName(location.city);
        setIsUpdateModalOpen(true);
    };

    const openDeleteModal = (category: Location) => {
        setSelectedLocation(category);
        setIsDeleteModalOpen(true);
    };

    return (
        <div>
            <Navmin />
            <div className="w-full ps-[170px]">
                <div className="w-full flex justify-between pe-8 pt-16">
                    <h1 className="text-[28px] mb-4 font-russo">Lokasi</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mb-4 px-4 py-2 bg-custom-navy text-white rounded hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                    >
                        Tambah Lokasi
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
                    <div className="me-8">
                        <table className="min-w-full bg-white border border-gray-200 font-sans rounded-lg overflow-hidden shadow-lg ">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Kota</th>
                                    <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {locations.length > 0 ? (
                                    locations.map((location) => (
                                        <tr key={location.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6">{location.city}</td>
                                            <td className="py-4 px-6">
                                                <div className="w-full flex gap-3">
                                                    <button
                                                        onClick={() => openUpdateModal(location)}
                                                        className="bg-yellow-500 text-white w-[40px] h-[40px] justify-center rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center text-sm"
                                                    >
                                                        <img src="../icons/edit.svg" alt="" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(location)}
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
                                        <td colSpan={2} className="py-4 px-6 text-center text-gray-500">
                                            Tidak ada Lokasi yang tersedia.
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
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="Nama kategori"
                    className="w-full px-4 py-2 border rounded mb-4"
                    required
                />
                <button
                    onClick={handleAddLocation}
                    className="mb-4 px-4 py-2 bg-custom-navy text-white rounded hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                >
                    Simpan
                </button>
            </Modal>

            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Update Kategori</h2>
                <input
                    type="text"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="Nama kategori"
                    className="w-full px-4 py-2 border rounded mb-4"
                />
                <button
                    onClick={handleUpdateLocation}
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
                        onClick={handleDeleteLocation}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Hapus
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default Lokasi;
