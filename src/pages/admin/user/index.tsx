import { useEffect, useState } from 'react';
import { User } from '@/types/types';
import axios from 'axios';
import Alert from '@/components/Alert';
import Modal from '@/components/modal';
import Navmin from '@/components/Navmin';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<{ username: string; password: string; role: string }>({ username: '', password: '', role: 'user' });

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/user`);
            console.log('API Response:', response.data);

            const usersData = response.data.users;

            if (Array.isArray(usersData)) {
                const filteredUsers = usersData
                    .filter((user: User) => user.role === 'user')
                    .sort((a: User, b: User) => b.id - a.id);

                setUsers(filteredUsers);
            } else {
                console.error('Users data is not an array:', usersData);
                setUsers([]);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching Users:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUsers = async () => {
        if (!selectedUser) return;

        try {
            await axios.delete(`${API_URL}/user/${selectedUser.id}`);

            setIsDeleteModalOpen(false);
            setAlert({ type: 'success', message: 'User berhasil dihapus' });

            setTimeout(() => { setAlert(null); }, 2000);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            setAlert({ type: 'error', message: 'Gagal menghapus user' });
            setTimeout(() => { setAlert(null); }, 2000);
        }
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleAddUser = async () => {
        try {
            await axios.post(`${API_URL}/register`, newUser);
            setIsAddModalOpen(false);
            setAlert({ type: 'success', message: 'User berhasil ditambahkan' });
            setTimeout(() => { setAlert(null); }, 2000);
            
            setNewUser({ username: '', password: '', role: 'user' });

            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
            setAlert({ type: 'error', message: 'Gagal menambahkan user' });
            setTimeout(() => { setAlert(null); }, 2000);
        }
    };

    return (
        <div>
            <Navmin />
            {alert && (
                <Alert
                    type={alert.type as any}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className="ps-[170px] p-4">
                <div className="w-full flex justify-between pe-8 pt-16">
                    <h1 className="text-[28px] mb-4 font-russo">User</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mb-4 px-4 py-2 bg-custom-navy text-white rounded hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                    >
                        Tambah Akun
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <p className="text-gray-500">Loading...</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full bg-white border border-gray-200 font-sans rounded-lg overflow-hidden shadow-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">
                                            Password
                                        </th>
                                        <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 text-left border-b text-gray-600 font-semibold uppercase text-sm tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-[15px] text-gray-700">
                                                    {user.username}
                                                </td>
                                                <td className="px-4 py-3 text-[15px] text-gray-700">
                                                    **********
                                                </td>
                                                <td className="px-4 py-3 text-[15px] text-gray-700">
                                                    {user.role}
                                                </td>
                                                <td className="px-4 py-3 text-[15px] text-gray-700">
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
                                                        className="bg-red-500 text-white w-[40px] h-[40px] justify-center rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center text-sm"
                                                    >
                                                        <img src="../icons/delete.svg" alt="" className='w-[20px]' />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center">
                                                Tidak ada user yang tersedia.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {isDeleteModalOpen && (
                <Modal isOpen={isDeleteModalOpen} onClose={handleCloseModal}>
                    <div className="p-4">
                        <h2 className="text-lg mb-4">Konfirmasi Hapus</h2>
                        <p>Apakah Anda yakin ingin menghapus user ini?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 border border-gray-300 rounded-md mr-2"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteUsers}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {isAddModalOpen && (
                <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                    <div className="p-4">
                        <h2 className="text-lg mb-4">Tambah Akun</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        />
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md mr-2"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="px-4 py-2 bg-custom-navy text-white rounded hover:bg-white hover:text-custom-navy border border-custom-navy duration-300 ease-in-out"
                            >
                                Tambah
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Users;