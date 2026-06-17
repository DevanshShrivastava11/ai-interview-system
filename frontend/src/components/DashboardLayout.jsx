import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children, darkMode, setDarkMode }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8 transition-colors duration-200">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
