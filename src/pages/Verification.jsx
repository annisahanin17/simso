import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserMenu from '../components/UserMenu';

const Verification = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    const res = await fetch('/.netlify/functions/requests', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('simso_token')}` }
    });
    if (res.ok) {
      const data = await res.json();
      setRequests(data.filter(r => r.status === 'Pending'));
    }
  };

  const handleUpdate = async (id, status) => {
    const res = await fetch('/.netlify/functions/requests', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('simso_token')}`
      },
      body: JSON.stringify({ id, status })
    });

    if (res.ok) {
      fetchPendingRequests();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-100">
      <header className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Verifikasi Permintaan</h1>
        </div>
        <UserMenu user={user} onLogout={logout} />
      </header>

      <main className="p-6 space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Tidak ada permintaan menunggu verifikasi</div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{req.drug_name}</h3>
                  <p className="text-sm text-gray-500">{req.quantity} Unit • {req.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${req.priority === 'Emergency' ? 'bg-red-100 text-red-600' :
                    req.priority === 'Urgent' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                  }`}>
                  {req.priority}
                </span>
              </div>

              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                Diajukan oleh: {req.requester_name}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => handleUpdate(req.id, 'Processing')}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Setujui & Proses</span>
                </button>
                <button
                  onClick={() => handleUpdate(req.id, 'Rejected')}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak</span>
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Verification;