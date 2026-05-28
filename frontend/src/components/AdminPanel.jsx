import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  const [users, setUsers] = useState([]);
  const [animalPrice, setAnimalPrice] = useState('');
  const [amounts, setAmounts] = useState({});
  const [message, setMessage] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchUsers = () => {
    fetch('http://localhost:5000/api/summary')
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
  };

  useEffect(() => { 
    if (isAdminLoggedIn) fetchUsers(); 
  }, [isAdminLoggedIn]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPassword })
    });
    if (response.ok) {
      setIsAdminLoggedIn(true);
      setMessage('');
    } else {
      setMessage('❌ Invalid password!');
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/set-animal-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: Number(animalPrice) })
    });
    setMessage('🐄 Animal price updated successfully!');
    setAnimalPrice('');
  };

  const handleAddCash = async (userId) => {
    const cashAmount = amounts[userId];
    if (!cashAmount) return;

    const response = await fetch('http://localhost:5000/api/add-cash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount: cashAmount })
    });

    if (response.ok) {
      setMessage('✨ Amount added and WhatsApp receipt sent!');
      setAmounts(prev => ({ ...prev, [userId]: '' }));
      fetchUsers();
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/edit-user/${editingUser}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFormData)
    });
    if (response.ok) {
      setMessage('✅ User details updated successfully!');
      setEditingUser(null);
      fetchUsers();
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 px-4 font-number">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 uppercase tracking-wide">Admin Login</h2>
          {message && <p className="text-red-500 text-sm mb-4 font-bold">{message}</p>}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={adminPassword} 
              onChange={e => setAdminPassword(e.target.value)} 
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-emerald-500 text-center font-bold" 
              required 
            />
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto font-number mb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wide">⚙️ Admin Control Panel</h2>
        <button onClick={() => setIsAdminLoggedIn(false)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100">Logout</button>
      </div>

      {message && <p className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center mb-6 text-emerald-800 font-bold">{message}</p>}

      <form onSubmit={handleUpdatePrice} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row gap-3">
        <input type="number" placeholder="Enter target price per animal (e.g. 35000)" value={animalPrice} onChange={e => setAnimalPrice(e.target.value)} className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-emerald-500 font-bold" required />
        <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-md">Update Price</button>
      </form>

      <h3 className="font-extrabold mb-4 text-slate-700 uppercase tracking-wider text-sm">Contributors Management</h3>
      
      <div className="space-y-4">
        {users.map(u => (
          <div key={u._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            
            {editingUser === u._id ? (
              <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" placeholder="Name" />
                <input type="text" value={editFormData.mobileNumber} onChange={e => setEditFormData({...editFormData, mobileNumber: e.target.value})} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" placeholder="Mobile" />
                <input type="text" value={editFormData.whatsappNumber} onChange={e => setEditFormData({...editFormData, whatsappNumber: e.target.value})} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" placeholder="WhatsApp" />
                <textarea value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" placeholder="Address" rows="1"></textarea>
                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setEditingUser(null)} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-xl font-bold text-sm hover:bg-slate-200">Cancel</button>
                  <button type="submit" className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700">Save</button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-extrabold text-slate-800 text-lg">{u.name}</p>
                    <button onClick={() => { setEditingUser(u._id); setEditFormData(u); }} className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200 transition-colors">✏️ Edit</button>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">📞 {u.mobileNumber} | 📱 {u.whatsappNumber}</p>
                  <p className="text-emerald-700 font-black mt-3 bg-emerald-50 inline-block px-3 py-1 rounded-xl border border-emerald-100/50">Total Paid: ₹{u.amountPaid.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto mt-3 md:mt-0 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <input type="number" placeholder="Amount (₹)" value={amounts[u._id] || ''} onChange={e => setAmounts({...amounts, [u._id]: e.target.value})} className="p-3 bg-white border border-slate-100 rounded-xl w-full md:w-32 font-bold text-slate-800 focus:outline-emerald-500" />
                  <button onClick={() => handleAddCash(u._id)} className="bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap hover:bg-slate-800 shadow-md transition-all">+ Add Cash</button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;