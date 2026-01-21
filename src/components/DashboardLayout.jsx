import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const { theme, font } = JSON.parse(savedSettings);
      document.body.className = `theme-${theme} font-${font}`;
    }
  }, []);

  // Get active item from current path
  const getActiveItem = () => {
    const path = location.pathname.replace('/dashboard/', '').replace('/dashboard', '');
    return path || 'dashboard';
  };

  return (
    <div className="bg-theme-primary h-screen overflow-hidden transition-colors duration-500">
      <Sidebar activeItem={getActiveItem()} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex flex-col h-screen transition-all duration-300" style={{ marginLeft: isCollapsed ? '64px' : '256px' }}>
        <Navbar isCollapsed={isCollapsed} />
        <main className="flex-1 overflow-y-auto mt-20 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;