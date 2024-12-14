import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        username,
        password,
      });
      const { token, role, username: loggedUsername } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username: loggedUsername }));

      if (role === 'user') {
        router.push('/');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      setError('Login failed. username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='w-full flex justify-between'>
        <div className="w-[840px] h-[750px] flex justify-center items-center">
          <div className="w-[578px] h-[640px]">
            <button onClick={() => router.push('/')} className='w-[50px] h-[50px] rounded-full absolute z-10 top-0 mt-[70px] bg-opacity-50 flex justify-center items-center bg-black hover:bg-opacity-25 duration-300 ease-in-out '><img src="../icons/back.png" alt="" /></button>
            <img src="../images/logo.png" alt="" className='w-[100px] mx-auto' />
            <h1 className='text-[36px] text-center mb-[70px]'>Masuk ke Acara</h1>
            <form onSubmit={handleSubmit}>
              <div className="">
                <label htmlFor="username ">Username</label>
                <input
                  id='username'
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukan Username"
                  required
                  className='w-[578px] h-[46px] border-none text-gray-900 bg-slate-100 px-9 mt-[15px]'
                />
              </div>
              <div className="mt-[40px]">
                <label htmlFor="password">Password</label>
                <input
                  id='password'
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className='w-[578px] h-[46px] border-none text-gray-900 bg-slate-100 px-9 mt-[15px]'
                />
              </div>
              <div className="mt-[50px] w-full flex justify-center">
                <button type="submit" className='bg-custom-navy w-[257px] h-[40px] rounded-[5px] text-white text-[16px] border-2 border-custom-navy hover:bg-white hover:text-custom-navy duration-300 ease-in-out flex items-center justify-center'>
                  {loading ? (
                    <div className="flex flex-row gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:.7s]"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:.3s]"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:.7s]"></div>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-[600px] h-[750px] bg-slate-800 flex justify-center items-center overflow-hidden">
          <img src="https://i.pinimg.com/736x/d5/68/90/d56890860e3ed824d9fb7a94dcdaba21.jpg" alt="" className='w-[600px] relative mb-[0px]' />
          <div className="text-white bg-white bg-opacity-40 w-[132px] h-[49px] rounded-[5px] flex justify-center items-center absolute">
            <a href="/register">SigUp</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
