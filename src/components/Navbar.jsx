import { useState, useEffect } from 'react';
import { FaBookOpen, FaUser } from 'react-icons/fa';
import { authAPI } from '../services/api';

const Navbar = ({ isCollapsed }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profile, setProfile] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchProfile();

    return () => clearInterval(timer);
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await authAPI.getProfile();
      const profileData = data.data?.librarian || data.data?.admin || data.data;
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile');
    }
  };

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
    <nav className="bg-white shadow-lg border-b border-gray-200 px-6 py-4 fixed top-0 right-0 left-0 z-40" style={{ marginLeft: isCollapsed ? '64px' : '256px' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-md">
            <FaBookOpen className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Library Management System</h1>
            <p className="text-sm text-gray-600">Digital Library Solutions</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm font-medium text-gray-800">
              {formatDate(currentTime)}
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full shadow-sm overflow-hidden">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-white text-sm" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">{profile?.name || user.name || 'Librarian'}</div>
              <div className="text-xs text-gray-600">{profile?.staffId || user.id || 'LIB-001'}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;