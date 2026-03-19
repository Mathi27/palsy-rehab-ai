import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ExerciseGuide from './components/ExerciseGuide';
import PWAInstallPrompt from './components/PWAInstallPrompt'; // Import the new prompt
import { Activity, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-medical text-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wide">Face App Rehab</h1>
          <nav className="flex gap-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-medical-dark' : 'hover:bg-medical-dark/50'}`}
            >
              <LayoutDashboard size={20} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('exercise')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${activeTab === 'exercise' ? 'bg-medical-dark' : 'hover:bg-medical-dark/50'}`}
            >
              <Activity size={20} />
              <span className="hidden sm:inline">Exercises</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 pb-20">
        {activeTab === 'dashboard' ? <Dashboard /> : <ExerciseGuide />}
      </main>

      {/* Version Footer */}
      <footer className="w-full text-center py-6 text-slate-400 text-sm font-medium">
        FaceApp for Bell's Palsy V1.0
      </footer>

      {/* Mobile PWA Install Notification (Invisible unless on mobile and uninstalled) */}
      <PWAInstallPrompt />
    </div>
  );
}