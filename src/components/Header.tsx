import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Users, Shield } from 'lucide-react';

export function Header() {
  const { currentUser, logout } = useApp();

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Kermisfuif Sponsors</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-slate-300">
              {currentUser?.rol === 'admin' && (
                <Shield className="h-4 w-4 mr-1 text-emerald-400" />
              )}
              <span className="text-sm font-medium">{currentUser?.naam}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}