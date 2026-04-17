import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
  FaHome, FaBook, FaUsers, FaUserGraduate, FaClipboardList,
  FaChartBar, FaCog, FaKey, FaSignOutAlt, FaBars, FaTimes, FaFileAlt, FaBell, FaIdCard, FaBookmark, FaUser, FaMoneyBillWave, FaEnvelope, FaExchangeAlt, FaBookOpen
} from 'react-icons/fa';

const Sidebar = ({ activeItem, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/dashboard' },
      ]
    },
    {
      title: 'Book Management',
      items: [
        { id: 'books', label: 'Books Catalog', icon: FaBook, path: '/dashboard/books' },
        { id: 'book-categorization', label: 'Categorization', icon: FaBookmark, path: '/dashboard/book-categorization' },
        { id: 'digital-library', label: 'Digital Library', icon: FaFileAlt, path: '/dashboard/digital-library' },
        { id: 'book-limits', label: 'Book Limits', icon: FaBookOpen, path: '/dashboard/book-limits' },
      ]
    },
    {
      title: 'Issue & Return',
      items: [
        { id: 'book-issue', label: 'Issue Tracking', icon: FaClipboardList, path: '/dashboard/book-issue' },
        { id: 'book-transactions', label: 'Transactions', icon: FaExchangeAlt, path: '/dashboard/book-transactions' },
        { id: 'book-requests', label: 'Book Requests', icon: FaEnvelope, path: '/dashboard/book-requests' },
        { id: 'due-alerts', label: 'Due Alerts', icon: FaBell, path: '/dashboard/due-alerts' },
      ]
    },
    {
      title: 'Members',
      items: [
        { id: 'students', label: 'Students', icon: FaUserGraduate, path: '/dashboard/students' },
        { id: 'members', label: 'Members', icon: FaUsers, path: '/dashboard/members' },
        { id: 'library-cards', label: 'Library Cards', icon: FaIdCard, path: '/dashboard/library-cards' },
      ]
    },
    {
      title: 'Finance & Reports',
      items: [
        { id: 'fine-management', label: 'Fine Management', icon: FaMoneyBillWave, path: '/dashboard/fine-management' },
        { id: 'reports', label: 'Reports', icon: FaChartBar, path: '/dashboard/reports' },
      ]
    },
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
        window.location.href = '/';
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
    <div className={`bg-gray-900 text-gray-100 h-screen fixed left-0 top-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col z-50 border-r border-gray-700 shadow-lg overflow-hidden`}>
      <style>{`
        nav::-webkit-scrollbar {
          width: 6px;
        }
        nav::-webkit-scrollbar-track {
          background: #1f2937;
        }
        nav::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        nav::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
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

      <nav className="flex-1 px-4 py-6 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5563 #1f2937' }}>
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors cursor-pointer ${activeItem === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'hover:bg-gray-800 text-gray-300'
                        }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <Icon className={`${isCollapsed ? 'text-xl' : 'text-base'} flex-shrink-0`} />
                      {!isCollapsed && <span className="ml-3 text-sm">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
            {!isCollapsed && sectionIndex < menuSections.length - 1 && (
              <div className="border-b border-gray-700 mt-4"></div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 flex-shrink-0 space-y-2">
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300 transition"
          title={isCollapsed ? 'Profile' : ''}
        >
          <FaUser className={`${isCollapsed ? 'text-lg' : 'text-lg'}`} />
          {!isCollapsed && <span className="ml-3">Profile</span>}
        </button>
        <button
          onClick={handleChangePassword}
          className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer text-gray-300 transition"
          title={isCollapsed ? 'Change Password' : ''}
        >
          <FaKey className={`${isCollapsed ? 'text-lg' : 'text-lg'}`} />
          {!isCollapsed && <span className="ml-3">Change Password</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg hover:bg-red-900 text-red-400 hover:text-red-300 cursor-pointer transition"
          title={isCollapsed ? 'Logout' : ''}
        >
          <FaSignOutAlt className={`${isCollapsed ? 'text-lg' : 'text-lg'}`} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;