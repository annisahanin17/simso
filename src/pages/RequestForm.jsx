import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MapPin, Clipboard, Camera } from 'lucide-react';

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    drug_name: '',
    quantity: '',
    location: '',
    priority: 'Normal',
    photo_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/.netlify/functions/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('simso_token')}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert('Permintaan berhasil dikirim!');
      navigate('/');
    } else {
      alert('Gagal mengirim permintaan');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-100">
      <header className="p-6 bg-white border-b border-gray-100 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Input Permintaan</h1>
      </header>

      <main className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <Clipboard className="w-4 h-4 mr-2 text-primary" /> Nama Obat
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Paracetamol 500mg"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              value={formData.drug_name}
              onChange={(e) => setFormData({...formData, drug_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
               Jumlah
            </label>
            <input
              type="number"
              required
              placeholder="Contoh: 20"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-primary" /> Lokasi / Ruangan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: IGD / Poliklinik A"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Prioritas</label>
            <div className="grid grid-cols-3 gap-2">
              {['Normal', 'Urgent', 'Emergency'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                    formData.priority === p 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                    : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-gray-700 flex items-center">
              <Camera className="w-4 h-4 mr-2 text-primary" /> Foto (Opsional)
            </label>
            <div className="w-full h-32 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-primary transition-colors cursor-pointer">
               <Camera className="w-8 h-8 mb-2" />
               <span className="text-xs font-medium">Klik untuk upload foto</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center space-x-2 ${
              submitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark shadow-primary/40 active:scale-95'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>{submitting ? 'Mengirim...' : 'Kirim Permintaan'}</span>
          </button>
        </form>
      </main>
    </div>
  );
};

export default RequestForm;
