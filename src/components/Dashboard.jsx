import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getHistory, clearHistory } from '../utils/storage'; 
import { Trash2, Activity } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const history = getHistory();
    const formattedData = history.map(session => ({
      ...session,
      date: new Date(session.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));
    setData(formattedData);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to permanently delete all progress data? This cannot be undone.")) {
      clearHistory();
      setData([]); 
    }
  };

return (
    <div key={Date.now()} className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Progress</h2>
            <p className="text-slate-500 text-sm italic">Tracking your facial symmetry over time.</p>
          </div>
          
          {/* THE BUTTON: Bright Red, Always Visible */}
          <button 
            type="button"
            onClick={handleClearData}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-lg transition-all z-50"
          >
            <Trash2 size={20} />
            <span>Clear History</span>
          </button>
        </div>
        
        {/* DATA SECTION */}
        {data.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
            <Activity size={48} className="mb-4 opacity-20" />
            <p>No session data yet. Complete an exercise to see your progress!</p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" name="Mouth Symmetry (%)" dataKey="symmetry" stroke="#0284c7" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" name="Eye Closure Quality" dataKey="eyeClosure" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}