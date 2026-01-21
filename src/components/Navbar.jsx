import { useState, useEffect } from 'react';
import { FaBookOpen, FaUser } from 'react-icons/fa';

const Navbar = ({ isCollapsed }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <nav className="bg-theme-secondary shadow-lg border-b border-gray-200 px-6 py-4 fixed top-0 right-0 left-0 z-40 transition-colors duration-500" style={{ marginLeft: isCollapsed ? '64px' : '256px' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-md">
            <FaBookOpen className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-theme-primary">Library Management System</h1>
            <p className="text-sm text-theme-secondary">Digital Library Solutions</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm font-medium text-theme-primary">
              {formatDate(currentTime)}
            </div>

          </div>

          <div className="flex items-center space-x-3 bg-gray-50/10 rounded-lg px-4 py-2 border border-gray-200/20 shadow-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full shadow-sm">
              <FaUser className="text-white text-sm" />
            </div>
            <div>
              <div className="text-sm font-medium text-theme-primary">{user.id || 'Admin'}</div>
              <div className="text-xs text-theme-secondary">{user.role || 'Administrator'}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;