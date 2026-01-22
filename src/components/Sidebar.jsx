import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
  FaHome, FaBook, FaUsers, FaUserGraduate, FaClipboardList,
  FaChartBar, FaCog, FaKey, FaSignOutAlt, FaBars, FaTimes
} from 'react-icons/fa';

const Sidebar = ({ activeItem, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/dashboard' },
    { id: 'books', label: 'Books Management', icon: FaBook, path: '/dashboard/books' },
    { id: 'book-transactions', label: 'Book Transactions', icon: FaClipboardList, path: '/dashboard/book-transactions' },
    { id: 'members', label: 'Members', icon: FaUsers, path: '/dashboard/members' },
    { id: 'students', label: 'Students', icon: FaUserGraduate, path: '/dashboard/students' },
    { id: 'reports', label: 'Reports', icon: FaChartBar, path: '/dashboard/reports' },
    // { id: 'settings', label: 'Settings', icon: FaCog, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/');
      }
    });
  };

  const handleChangePassword = () => {
    navigate('/dashboard/change-password');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`bg-gray-900 text-gray-100 min-h-screen fixed left-0 top-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col z-50 border-r border-gray-700 shadow-lg`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold text-white">Library System</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300"
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors cursor-pointer ${activeItem === item.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                    }`}
                >
                  <Icon className={`${isCollapsed ? 'text-3xl' : 'text-lg'}`} />
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
          className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800 mb-2 cursor-pointer text-gray-300"
        >
          <FaKey className={`${isCollapsed ? 'text-3xl' : 'text-lg'}`} />
          {!isCollapsed && <span className="ml-3">Change Password</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg hover:bg-red-900 text-red-400 hover:text-red-300 cursor-pointer"
        >
          <FaSignOutAlt className={`${isCollapsed ? 'text-3xl' : 'text-lg'}`} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;