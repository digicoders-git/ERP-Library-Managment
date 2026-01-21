import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaHome, FaBook, FaUsers, FaUserGraduate, FaClipboardList, 
  FaChartBar, FaCog, FaKey, FaSignOutAlt, FaBars, FaTimes 
} from 'react-icons/fa';

const Sidebar = ({ activeItem, setActiveItem, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'books', label: 'Books Management', icon: FaBook },
    { id: 'book-transactions', label: 'Book Transactions', icon: FaClipboardList },
    { id: 'members', label: 'Members', icon: FaUsers },
    { id: 'students', label: 'Students', icon: FaUserGraduate },
    { id: 'reports', label: 'Reports', icon: FaChartBar },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleChangePassword = () => {
    toast.info('Change password functionality would be implemented here');
  };

  return (
    <div className={`bg-gray-900 text-white min-h-screen fixed left-0 top-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col z-50`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold">Library System</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                    activeItem === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <Icon className="text-lg" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleChangePassword}
          className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700 mb-2 cursor-pointer"
        >
          <FaKey className="text-lg" />
          {!isCollapsed && <span className="ml-3">Change Password</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg hover:bg-red-600 text-red-400 hover:text-white cursor-pointer"
        >
          <FaSignOutAlt className="text-lg" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;