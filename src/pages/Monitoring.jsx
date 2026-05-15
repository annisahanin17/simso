import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserMenu from '../components/UserMenu';

const normalizeRole = (role) => (role ?? '').toString().trim().toLowerCase();

const Monitoring = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Semua');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await fetch('/.netlify/functions/requests', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('simso_token')}` }
    });
    if (res.ok) {
      const data = await res.json();
      setRequests(data);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const canUpdateStatus = normalizeRole(user?.role) === 'logistik';

  const updateStatus = async (id, status) => {
    const res = await fetch('/.netlify/functions/requests', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('simso_token')}`
      },
      body: JSON.stringify({ id, status })
    });

    if (res.ok) {
      fetchRequests();
      return;
    }
    let msg = 'Gagal update status';
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch { }
    alert(msg);
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'Semua') return true;
    if (filter === 'Pending') return r.status === 'Pending';
    if (filter === 'Diproses') return r.status === 'Processing';
    if (filter === 'Selesai') return r.status === 'Completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-100 flex flex-col">
      <header className="p-6 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Monitoring Real-Time</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRequests}
            disabled={loading}
            className={`p-2 rounded-xl transition-all ${loading ? 'animate-spin text-primary' : 'text-gray-400 hover:text-primary'}`}
            aria-label="Refresh"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <UserMenu user={user} onLogout={logout} />
        </div>
      </header>

      <div className="p-6 bg-white border-b border-gray-100 flex space-x-2 overflow-x-auto no-scrollbar">
        {['Semua', 'Pending', 'Diproses', 'Selesai'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${filter === f ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-white text-gray-500 border-gray-200'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Belum ada data permintaan</div>
        ) : (
          filteredRequests.map(req => (
            <div key={req.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400">ID #{req.id}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{req.drug_name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">{req.quantity} Unit • {req.location}</p>
                  <p className="text-[10px] text-gray-400">{new Date(req.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-100 rounded-full mr-2" />
                  <span className="text-[10px] font-medium text-gray-500">{req.requester_name}</span>
                </div>
                {canUpdateStatus && req.status === 'Processing' ? (
                  <button
                    onClick={() => updateStatus(req.id, 'Completed')}
                    className="text-green-700 text-[10px] font-bold flex items-center bg-green-50 border border-green-100 px-3 py-2 rounded-full hover:bg-green-100 transition-all"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Tandai Selesai
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-400 font-medium"> </span>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Monitoring;