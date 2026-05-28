import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  const [view, setView] = useState('dashboard'); 
  const [currentUser, setCurrentUser] = useState(null);

  return (
    // ഇവിടെ max-w-[100vw] നൽകിയത് സ്ക്രീനിന് പുറത്തേക്ക് പോകാതിരിക്കാനാണ്
    <div className="bg-slate-50 min-h-screen pb-12 w-full max-w-[100vw] overflow-x-hidden font-number">
      
      <div className="pt-2 px-2 sm:px-4 max-w-5xl mx-auto sticky top-0 z-50">
        <nav className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm p-3 flex flex-col items-center gap-3 rounded-2xl w-full">
          
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-base shadow-inner shrink-0">🐄</div>
            <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-500 text-base sm:text-lg tracking-tight text-center">
              Uluhiyyath Fund
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 flex-wrap w-full">
            <button onClick={() => setView('dashboard')} className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${view === 'dashboard' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>Home</button>
            
            {currentUser ? (
              <button 
                onClick={() => setView('profile')} 
                className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${view === 'profile' ? 'bg-emerald-700 text-white' : 'text-emerald-800 bg-emerald-100 hover:bg-emerald-200'} max-w-[100px] truncate`}
              >
                👤 {currentUser.name}
              </button>
            ) : (
              <button onClick={() => setView('login')} className="text-[10px] sm:text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 shadow-md">Login</button>
            )}

            <button onClick={() => setView('admin')} className="text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100">Admin</button>
          </div>
        </nav>
      </div>

      <div className="px-2 sm:px-4 max-w-5xl mx-auto mt-4 w-full">
        {view === 'dashboard' && <Dashboard />}
        {view === 'login' && <Login onLoginSuccess={(user) => { setCurrentUser(user); setView('dashboard'); }} />}
        {view === 'admin' && <AdminPanel />}
        {view === 'profile' && (
          <Profile 
            currentUser={currentUser} 
            onProfileUpdate={(updatedUser) => setCurrentUser(updatedUser)} 
          />
        )}
      </div>
    </div>
  );
}

export default App;