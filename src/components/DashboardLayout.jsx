import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const { theme, font } = JSON.parse(savedSettings);
      document.body.className = `theme-${theme} font-${font}`;
    }
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;