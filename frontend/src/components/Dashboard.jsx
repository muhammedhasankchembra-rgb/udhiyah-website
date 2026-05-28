import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalFund, setTotalFund] = useState(0);
  const [pricePerAnimal, setPricePerAnimal] = useState(35000);
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", mins: "00" });

  useEffect(() => {
    fetch('https://udhiyah-website.onrender.com/api/summary')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setTotalFund(data.totalFund || 0);
        setPricePerAnimal(data.pricePerAnimal || 35000);
      })
      .catch(err => console.error("Error:", err));

    const targetDate = new Date("May 16, 2027 00:00:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
          mins: String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const completedAnimals = Math.floor(totalFund / pricePerAnimal);
  const progressPercentage = ((totalFund % pricePerAnimal) / pricePerAnimal) * 100;

  return (
    <div className="w-full">
      
      {/* Countdown Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-10 rounded-3xl sm:rounded-[2rem] mb-4 shadow-xl relative overflow-hidden flex flex-col items-center justify-center border-2 border-white/10 w-full">
        <div className="bg-emerald-950/50 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full text-[8px] sm:text-xs font-bold text-emerald-200 mb-4 uppercase tracking-wider text-center w-full sm:w-auto truncate">
          Time Remaining for Udhiyah
        </div>
        
        <div className="flex justify-center items-center gap-2 sm:gap-6 w-full max-w-[250px] sm:max-w-none mx-auto">
          <div className="flex flex-col items-center w-16 sm:w-auto">
            <span className="text-2xl sm:text-5xl font-black tracking-tighter drop-shadow-md">{timeLeft.days}</span>
            <span className="text-emerald-300 font-bold text-[8px] sm:text-xs tracking-widest uppercase mt-1">Days</span>
          </div>
          <span className="text-xl sm:text-4xl font-black text-emerald-600/50 pb-3">:</span>
          <div className="flex flex-col items-center w-16 sm:w-auto">
            <span className="text-2xl sm:text-5xl font-black tracking-tighter drop-shadow-md">{timeLeft.hours}</span>
            <span className="text-emerald-300 font-bold text-[8px] sm:text-xs tracking-widest uppercase mt-1">Hours</span>
          </div>
          <span className="text-xl sm:text-4xl font-black text-emerald-600/50 pb-3">:</span>
          <div className="flex flex-col items-center w-16 sm:w-auto">
            <span className="text-2xl sm:text-5xl font-black tracking-tighter drop-shadow-md">{timeLeft.mins}</span>
            <span className="text-emerald-300 font-bold text-[8px] sm:text-xs tracking-widest uppercase mt-1">Mins</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 w-full">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between w-full">
          <div className="min-w-0 pr-2 overflow-hidden">
            <h3 className="text-slate-400 font-bold uppercase text-[9px] sm:text-xs tracking-wider mb-1 truncate">Animals Completed</h3>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-4xl font-black text-slate-800">{completedAnimals}</span>
              <span className="text-[10px] sm:text-sm font-extrabold text-slate-400">Units</span>
            </div>
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-50 rounded-full flex items-center justify-center text-xl sm:text-2xl shrink-0">🐄</div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between w-full">
          <div className="min-w-0 pr-2 overflow-hidden">
            <h3 className="text-slate-400 font-bold uppercase text-[9px] sm:text-xs tracking-wider mb-1 truncate">Total Fund Raised</h3>
            <div className="flex items-baseline gap-1 truncate">
              <span className="text-base sm:text-xl font-bold text-emerald-600">₹</span>
              <span className="text-2xl sm:text-4xl font-black text-slate-800 truncate">{totalFund.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-50 rounded-full flex items-center justify-center text-xl sm:text-2xl shrink-0">🪙</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 mb-5 relative overflow-hidden w-full">
        <div className="flex justify-between items-center mb-3">
          <div className="min-w-0 pr-2">
            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm truncate">Progress to Next Animal</h4>
            <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5 truncate">Target: <span className="font-bold text-slate-600">₹{pricePerAnimal.toLocaleString('en-IN')}</span></p>
          </div>
          <span className="bg-slate-900 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-md shadow-md shrink-0">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5">
          <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Contributors List */}
      <div className="mb-10 w-full">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-xs sm:text-base font-extrabold text-slate-800 uppercase tracking-wider">Contributors</h3>
          <span className="bg-slate-200 text-slate-700 font-black px-2 py-0.5 rounded-md text-[9px]">{users.length}</span>
        </div>
        
        {users.length === 0 ? (
          <div className="text-center py-6 bg-white rounded-xl border border-dashed border-zinc-200 w-full">
            <p className="text-zinc-400 text-[10px] sm:text-xs font-medium">No contributors yet.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5 w-full">
            {users.map((user) => {
              const userShare = ((user.amountPaid / pricePerAnimal) * 100).toFixed(1);
              return (
                <div key={user._id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-800 text-sm font-black shadow-inner overflow-hidden shrink-0">
                      {user.photoUrl ? <img src={user.photoUrl} alt="User" className="w-full h-full object-cover"/> : user.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-800 text-[11px] sm:text-sm truncate">{user.name}</p>
                      <p className="font-bold text-emerald-600 text-[9px] sm:text-xs mt-0.5">₹{user.amountPaid.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md text-center shrink-0">
                    <p className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wide">Share</p>
                    <p className="font-black text-slate-700 text-[9px] sm:text-xs">{userShare}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;