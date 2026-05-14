import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Layout, User, Lock, Plus } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError('Error: Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <div className="bg-primary p-3 rounded-xl shadow-lg shadow-primary/30">
               <Plus className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full border-2 border-primary shadow-sm">
               <Plus className="w-3 h-3 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-blue-500 to-blue-700 tracking-wider">
            SIMSO
          </h1>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
             <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full shadow-lg shadow-primary/40 transition-all active:scale-95 text-lg"
            >
              Login
            </button>
            <button type="button" className="ml-4 text-blue-900 font-medium">
              Lupa Password?
            </button>
          </div>

          {error && (
            <p className="text-red-800 text-center font-medium mt-4">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
