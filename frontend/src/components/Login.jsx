import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isSameNumber, setIsSameNumber] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', mobileNumber: '', password: '', whatsappNumber: '', address: '', photoUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (isSameNumber && name === 'mobileNumber') updated.whatsappNumber = value;
      return updated;
    });
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
    const endpoint = isSignup ? 'signup' : 'login';
    
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        onLoginSuccess(data.user);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Server connection failed.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 mt-12 font-number mb-20">
      <h2 className="text-2xl font-extrabold mb-8 text-center text-slate-800">
        {isSignup ? 'Create Account' : 'Account Login'}
      </h2>

      {message && <p className="text-sm bg-red-50 border border-red-100 p-3 rounded-xl text-center mb-6 font-bold text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {isSignup && (
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Full Name</label>
            <input type="text" name="name" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-emerald-500 font-bold" required />
          </div>
        )}

        <div>
          <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Mobile Number</label>
          <input type="text" name="mobileNumber" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-emerald-500 font-bold" required />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Password</label>
          <input type="password" name="password" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-emerald-500 font-bold" required />
        </div>

        {isSignup && (
          <>
            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" id="same" checked={isSameNumber} onChange={(e) => {
                setIsSameNumber(e.target.checked);
                if(e.target.checked) setFormData(p => ({...p, whatsappNumber: p.mobileNumber}));
              }} className="w-4 h-4 accent-emerald-600" />
              <label htmlFor="same" className="text-sm font-bold text-slate-600 cursor-pointer">WhatsApp number is the same</label>
            </div>

            {!isSameNumber && (
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">WhatsApp Number</label>
                <input type="text" name="whatsappNumber" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-emerald-500 font-bold" />
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Address</label>
              <textarea name="address" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-emerald-500 font-bold" required></textarea>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Profile Picture (DP)</label>
              <div className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex items-center gap-3">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500" />
                  ) : (
                    <div className="text-2xl">📸</div>
                  )}
                  <span className="font-bold text-sm text-slate-600">
                    {formData.photoUrl ? 'Change Photo' : 'Upload from Gallery'}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold mt-4 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all">
          {isSignup ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm font-bold text-slate-400 mt-6 cursor-pointer hover:text-emerald-600" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default Login;