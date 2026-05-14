import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, ClipboardList, AlertCircle, LogOut, Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, completed: 0, stok_menipis: 0, obat_kadaluwarsa: 0 });
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, []);

  const fetchStats = async () => {
    const res = await fetch('/.netlify/functions/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('simso_token')}` }
    });
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  };

  const fetchRequests = async () => {
    const res = await fetch('/.netlify/functions/requests', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('simso_token')}` }
    });
    if (res.ok) {
      const data = await res.json();
      setRequests(data.slice(0, 5)); // Show only top 5
    }
  };

  const tabs = ['Dashboard', 'Permintaan', 'Stok', 'Riwayat', 'FEFO'];

  return (
    <div className="min-h-screen bg-white pb-20 max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100">
      {/* Header */}
      <header className="p-6 flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">SIMSO</h1>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-3 text-right">
           <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">User:</span>
              <span className="text-sm text-gray-500 font-medium">Petugas {user?.role}</span>
           </div>
           <div className="bg-blue-100 p-2 rounded-full border border-blue-200">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-8 h-8 rounded-full" alt="avatar" />
           </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 flex space-x-6 overflow-x-auto no-scrollbar border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-primary' : 'text-gray-400'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="p-6 grid grid-cols-3 gap-3">
        <div className="glass rounded-3xl p-4 flex flex-col space-y-4 border-t-4 border-yellow-400">
           <div className="bg-yellow-50 w-10 h-10 flex items-center justify-center rounded-xl">
              <Package className="w-5 h-5 text-yellow-600" />
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-800">Stok Menipis</p>
              <h3 className="text-xl font-extrabold text-gray-900">{stats.stok_menipis} Item</h3>
              <p className="text-[10px] text-gray-400 font-medium">Warning</p>
           </div>
        </div>

        <div className="glass rounded-3xl p-4 flex flex-col space-y-4 border-t-4 border-blue-400">
           <div className="bg-blue-50 w-10 h-10 flex items-center justify-center rounded-xl">
              <ClipboardList className="w-5 h-5 text-blue-600" />
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-800">Permintaan Pending</p>
              <h3 className="text-xl font-extrabold text-gray-900">{stats.pending}</h3>
              <p className="text-[10px] text-gray-400 font-medium">Action Required</p>
           </div>
        </div>

        <div className="glass rounded-3xl p-4 flex flex-col space-y-4 border-t-4 border-red-400">
           <div className="bg-red-50 w-10 h-10 flex items-center justify-center rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600" />
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-800">Obat Kadaluwarsa</p>
              <h3 className="text-xl font-extrabold text-gray-900">{stats.obat_kadaluwarsa}</h3>
              <p className="text-[10px] text-gray-400 font-medium">Alert</p>
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="px-6 mt-2">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Tabel Permintaan Terbaru</h3>
         </div>
         <div className="overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                     <th className="pb-4">ID</th>
                     <th className="pb-4">Nama Obat</th>
                     <th className="pb-4">Qty</th>
                     <th className="pb-4">Status</th>
                     <th className="pb-4 text-right">Tgl Permintaan</th>
                  </tr>
               </thead>
               <tbody className="text-xs font-medium text-gray-700">
                  {requests.map((req, idx) => (
                     <tr key={req.id} className="border-t border-gray-50">
                        <td className="py-4">{req.id}</td>
                        <td className="py-4 font-bold">{req.drug_name}</td>
                        <td className="py-4">{req.quantity}</td>
                        <td className="py-4">
                           <span className={`px-2 py-1 rounded-lg ${
                              req.status === 'Pending' ? 'text-yellow-600 bg-yellow-50' : 
                              req.status === 'Approved' ? 'text-green-600 bg-green-50' : 
                              'text-blue-600 bg-blue-50'
                           }`}>
                              {req.status}
                           </span>
                        </td>
                        <td className="py-4 text-right text-gray-400">{new Date(req.created_at).toLocaleDateString('id-ID')}</td>
                     </tr>
                  ))}
                  {requests.length === 0 && (
                     <tr><td colSpan="5" className="text-center py-10 text-gray-400">Belum ada data</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* FAB - Create New Request (For Farmasi) */}
      {user?.role === 'Farmasi' && (
        <button
          onClick={() => navigate('/request')}
          className="absolute bottom-6 right-6 bg-primary p-4 rounded-2xl shadow-xl shadow-primary/40 text-white active:scale-90 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="absolute top-6 left-6 text-gray-400 hover:text-red-500 transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Dashboard;
