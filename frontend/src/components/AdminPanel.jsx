import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // പുതിയ ആളെ ആഡ് ചെയ്യാനുള്ള സ്റ്റേറ്റ്
    const [formData, setFormData] = useState({ name: '', mobile: '', address: '', amount: '' });
    
    // ക്യാഷ് എഡിറ്റ് ചെയ്യാനുള്ള സ്റ്റേറ്റ്
    const [editingId, setEditingId] = useState(null);
    const [editAmount, setEditAmount] = useState('');

    const API_BASE_URL = 'https://udhiyah-website.onrender.com/api';
    const ADMIN_PASSWORD = 'admin@2026'; // 👈 ഇവിടെ നിങ്ങളുടെ അഡ്മിൻ പാസ്‌വേഡ് നൽകുക!

    // പേജ് ലോഡ് ചെയ്യുമ്പോൾ ലോഗിൻ സെഷൻ പരിശോധിക്കുക
    useEffect(() => {
        const loggedIn = localStorage.getItem('isAdminLoggedIn');
        if (loggedIn === 'true') {
            setIsAuthenticated(true);
            fetchUsers();
        }
    }, []);

    // അഡ്മിൻ ലോഗിൻ പരിശോധന
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('isAdminLoggedIn', 'true');
            fetchUsers();
            setError('');
        } else {
            setError('തെറ്റായ പാസ്‌വേഡ്!');
        }
    };

    // ലോഗൗട്ട് ചെയ്യുമ്പോൾ
    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdminLoggedIn');
    };

    // എല്ലാ ആളുകളുടെയും ലിസ്റ്റ് ഡാറ്റാബേസിൽ നിന്നും എടുക്കാൻ
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/users`);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError('ഡാറ്റ ലോഡ് ചെയ്യാൻ സാധിച്ചില്ല');
        }
    };

    // പുതിയ ആളെ അഡ്മിൻ വഴി ആഡ് ചെയ്യാൻ
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/users/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setFormData({ name: '', mobile: '', address: '', amount: '' });
                fetchUsers(); // ലിസ്റ്റ് അപ്‌ഡേറ്റ് ചെയ്യാൻ
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('ആളെ ചേർക്കാൻ സാധിച്ചില്ല');
        }
    };

    // തുക (Amount) എഡിറ്റ് ചെയ്യാൻ
    const handleUpdateAmount = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/${id}/amount`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(editAmount) })
            });
            if (res.ok) {
                setEditingId(null);
                setEditAmount('');
                fetchUsers();
            }
        } catch (err) {
            setError('തുക മാറ്റാൻ സാധിച്ചില്ല');
        }
    };

    // ഒരാളെ ലിസ്റ്റിൽ നിന്നും ഒഴിവാക്കാൻ (Remove User)
    const handleDeleteUser = async (id) => {
        if (window.confirm('ഈ അംഗത്തെ ലിസ്റ്റിൽ നിന്നും ഒഴിവാക്കണോ?')) {
            try {
                const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchUsers();
                }
            } catch (err) {
                setError('ഒഴിവാക്കാൻ സാധിച്ചില്ല');
            }
        }
    };

    // ലോഗിൻ പേജ് ഡിസൈൻ
    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96 text-center border">
                    <h2 className="text-2xl font-bold mb-4 text-emerald-600">അഡ്മിൻ ലോഗിൻ</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <input 
                        type="password" 
                        placeholder="Enter Admin Password" 
                        className="w-full p-3 border rounded-lg mb-4 text-center focus:outline-emerald-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-700 transition">Login</button>
                </form>
            </div>
        );
    }

    // മെയിൻ അഡ്മിൻ പാനൽ ഡിസൈൻ
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6 bg-emerald-600 p-4 rounded-xl text-white shadow">
                <h1 className="text-2xl font-bold">ഉളുഹിയ്യത്ത് ഫണ്ട് - അഡ്മിൻ പാനൽ</h1>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-600">Logout</button>
            </div>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</p>}
            {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">{message}</p>}

            {/* പുതിയ ആളെ ചേർക്കാനുള്ള ഫോം */}
            <div className="bg-white p-6 rounded-xl shadow border mb-8">
                <h3 className="text-xl font-bold mb-4 text-slate-700">പുതിയ അംഗത്തെ ചേർക്കുക</h3>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="പേര്" required className="p-3 border rounded-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="text" placeholder="മൊബൈൽ" required className="p-3 border rounded-lg" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                    <input type="text" placeholder="മേൽവിലാസം" required className="p-3 border rounded-lg" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    <input type="number" placeholder="തുക (Amount)" required className="p-3 border rounded-lg" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                    <button type="submit" className="md:col-span-4 bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-700">അംഗത്തെ ആഡ് ചെയ്യുക</button>
                </form>
            </div>

            {/* അംഗങ്ങളുടെ ലിസ്റ്റ് കാണിക്കുന്ന ടേബിൾ */}
            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                            <th className="p-4">പേര്</th>
                            <th className="p-4">മൊബൈൽ</th>
                            <th className="p-4">തുക</th>
                            <th className="p-4 text-center">നടപടികൾ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-slate-50 transition">
                                <td className="p-4 font-medium">{user.name}</td>
                                <td className="p-4 text-slate-600">{user.mobile}</td>
                                <td className="p-4 font-bold text-emerald-600">
                                    {editingId === user._id ? (
                                        <div className="flex items-center gap-2">
                                            <input type="number" className="p-1 border rounded w-24" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
                                            <button onClick={() => handleUpdateAmount(user._id)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Save</button>
                                            <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-xs">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            ₹{user.amount}
                                            <button onClick={() => { setEditingId(user._id); setEditAmount(user.amount); }} className="text-blue-500 text-xs underline ml-2">Edit</button>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleDeleteUser(user._id)} className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-200 transition">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;