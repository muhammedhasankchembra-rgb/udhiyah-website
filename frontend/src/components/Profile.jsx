import React, { useState } from 'react';

const Profile = ({ currentUser, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    mobileNumber: currentUser.mobileNumber,
    whatsappNumber: currentUser.whatsappNumber || '',
    address: currentUser.address,
    photoUrl: currentUser.photoUrl || ''
  });
  
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if(file.size > 2000000) { 
        alert("Image size should be less than 2MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/edit-user/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Profile updated successfully!');
        onProfileUpdate(data.user); 
      } else {
        setMessage('❌ Failed to save changes.');
      }
    } catch (err) {
      setMessage('❌ Server connection error.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 mt-12 font-number mb-20">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-slate-800 uppercase tracking-wide">👤 My Profile</h2>
      
      {message && <p className="text-sm bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center mb-6 font-bold text-emerald-700">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* DP Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden relative group cursor-pointer">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt="DP" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-emerald-50 text-emerald-700 font-bold">{formData.name[0]}</div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">Edit</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-bold uppercase tracking-wider">Click image to change</p>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:outline-emerald-500" required />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Mobile Number</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:outline-emerald-500" required />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-400 block mb-1">WhatsApp Number</label>
          <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:outline-emerald-500" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:outline-emerald-500" rows="3" required></textarea>
        </div>

        <button type="submit" className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold mt-4 hover:bg-emerald-700 shadow-lg shadow-emerald-700/20 transition-all">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;