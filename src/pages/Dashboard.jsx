import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaUsers, FaUserGraduate, FaClipboardList, FaArrowUp, FaArrowDown, FaPlus, FaEye, FaCalendarAlt, FaExclamationTriangle, FaSearch, FaBell, FaFilter, FaDownload, FaSyncAlt, FaClock, FaMoneyBillWave, FaChartLine, FaArrowUp as FaArrowTrendUp } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', title: '5 books are due for return today', message: 'Please send reminders to members', time: '2 hours ago', read: false },
    { id: 2, type: 'info', title: 'New book shipment arrived', message: '25 new books ready for cataloging', time: '4 hours ago', read: false },
    { id: 3, type: 'success', title: 'Monthly membership target achieved', message: 'Great job! 120% of target completed', time: '1 day ago', read: false },
    { id: 4, type: 'error', title: 'System maintenance scheduled', message: 'Maintenance on Sunday 2 AM - 4 AM', time: '2 days ago', read: true },
    { id: 5, type: 'warning', title: 'Low stock alert', message: 'Fiction section running low on popular titles', time: '3 days ago', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { title: 'Total Books', value: '2,547', icon: FaBook, color: 'bg-blue-500', change: '+12%', trend: 'up', description: 'Available: 1,891' },
    { title: 'Active Members', value: '1,234', icon: FaUsers, color: 'bg-green-500', change: '+8%', trend: 'up', description: 'New this month: 45' },
    { title: 'Students', value: '987', icon: FaUserGraduate, color: 'bg-purple-500', change: '+5%', trend: 'up', description: 'Active: 892' },
    { title: 'Books Issued', value: '456', icon: FaClipboardList, color: 'bg-orange-500', change: '-3%', trend: 'down', description: 'Due today: 23' },
  ];

  const recentActivities = [
    { action: 'Book Issued', details: 'Harry Potter - John Doe', time: '2 hours ago', type: 'issue' },
    { action: 'Book Returned', details: 'The Great Gatsby - Jane Smith', time: '4 hours ago', type: 'return' },
    { action: 'New Member', details: 'Alice Johnson registered', time: '6 hours ago', type: 'member' },
    { action: 'Book Added', details: 'Programming Concepts added', time: '1 day ago', type: 'book' },
    { action: 'Fine Collected', details: '₹50 from Bob Wilson', time: '2 days ago', type: 'fine' },
  ];

  const overdueBooks = [
    { title: 'To Kill a Mockingbird', member: 'John Smith', dueDate: '2024-01-20', daysOverdue: 5 },
    { title: '1984', member: 'Mary Johnson', dueDate: '2024-01-18', daysOverdue: 7 },
    { title: 'Pride and Prejudice', member: 'David Brown', dueDate: '2024-01-22', daysOverdue: 3 },
  ];

  const popularBooks = [
    { title: 'The Psychology of Money', author: 'Morgan Housel', issued: 45, category: 'Finance' },
    { title: 'Atomic Habits', author: 'James Clear', issued: 38, category: 'Self-Help' },
    { title: 'Clean Code', author: 'Robert Martin', issued: 32, category: 'Programming' },
    { title: 'The Alchemist', author: 'Paulo Coelho', issued: 28, category: 'Fiction' },
  ];

  const todayStats = {
    issued: 12,
    returned: 8,
    newMembers: 3,
    fineCollected: 250
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'error': return <FaExclamationTriangle className="text-red-500" />;
      case 'success': return <FaBell className="text-green-500" />;
      case 'info': return <FaBell className="text-blue-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'issue': navigate('/dashboard/book-transactions'); break;
      case 'return': navigate('/dashboard/book-transactions'); break;
      case 'addMember': navigate('/dashboard/members'); break;
      case 'addBook': navigate('/dashboard/books'); break;
      case 'reports': navigate('/dashboard/reports'); break;
      case 'fine': navigate('/dashboard/book-transactions'); break;
      default: break;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening in your library today.</p>
            <p className="text-sm text-gray-500 mt-1">{currentTime.toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4 mt-4 lg:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 lg:w-48"
              />
            <FaSearch 
              className="absolute left-2 top-3 text-gray-400 text-xs" 
              data-tooltip-id="dashboard-search-tooltip"
              data-tooltip-content="Search across dashboard"
            />
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              data-tooltip-id="refresh-tooltip"
              data-tooltip-content="Refresh dashboard data"
            >
              <FaSyncAlt className={isLoading ? 'animate-spin' : ''} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
                data-tooltip-id="notifications-tooltip"
                data-tooltip-content="View notifications"
              >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <div className="flex space-x-2">
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark all read
                        </button>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium text-gray-900 ${
                                !notification.read ? 'font-semibold' : ''
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-red-500 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <FaBell className="mx-auto text-3xl mb-2 opacity-50" />
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? FaArrowUp : FaArrowDown;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className={`p-2 lg:p-3 rounded-lg ${stat.color}`}>
                  <Icon className="text-white text-sm sm:text-lg lg:text-xl" />
                </div>
                <div className={`flex items-center text-xs lg:text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{stat.title}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {/* Recent Activities */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">Recent Activities</h2>
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-xs lg:text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Activities</option>
              <option value="issue">Issues</option>
              <option value="return">Returns</option>
              <option value="member">Members</option>
            </select>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const getActivityColor = (type) => {
                switch(type) {
                  case 'issue': return 'bg-blue-500';
                  case 'return': return 'bg-green-500';
                  case 'member': return 'bg-purple-500';
                  case 'book': return 'bg-orange-500';
                  case 'fine': return 'bg-red-500';
                  default: return 'bg-gray-500';
                }
              };
              return (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-3 h-3 ${getActivityColor(activity.type)} rounded-full mr-3`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Books */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Popular Books</h2>
          <div className="space-y-3">
            {popularBooks.map((book, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{book.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{book.issued}</p>
                  <p className="text-xs text-gray-500">times issued</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Monthly Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center">
                <FaArrowTrendUp className="text-blue-600 mr-3" />
                <span className="font-medium text-gray-800">Books Issued</span>
              </div>
              <span className="text-xl font-bold text-blue-600">+15%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center">
                <FaChartLine className="text-green-600 mr-3" />
                <span className="font-medium text-gray-800">Return Rate</span>
              </div>
              <span className="text-xl font-bold text-green-600">96%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center">
                <FaUsers className="text-purple-600 mr-3" />
                <span className="font-medium text-gray-800">Member Growth</span>
              </div>
              <span className="text-xl font-bold text-purple-600">+8%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-red-600 mr-3" />
                <span className="font-medium text-gray-800">Revenue</span>
              </div>
              <span className="text-xl font-bold text-red-600">₹12,450</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        {/* Today's Summary */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">Today's Summary</h2>
            <FaClock className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <FaClipboardList className="text-blue-600 mr-3" />
                <span className="font-medium text-gray-800">Books Issued</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{todayStats.issued}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <FaBook className="text-green-600 mr-3" />
                <span className="font-medium text-gray-800">Books Returned</span>
              </div>
              <span className="text-xl font-bold text-green-600">{todayStats.returned}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <FaUsers className="text-purple-600 mr-3" />
                <span className="font-medium text-gray-800">New Members</span>
              </div>
              <span className="text-xl font-bold text-purple-600">{todayStats.newMembers}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <FaCalendarAlt className="text-red-600 mr-3" />
                <span className="font-medium text-gray-800">Fine Collected</span>
              </div>
              <span className="text-xl font-bold text-red-600">₹{todayStats.fineCollected}</span>
            </div>
          </div>
        </div>

        {/* Overdue Books Alert */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <h2 className="text-lg lg:text-xl font-bold text-gray-800">Overdue Books</h2>
            </div>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{overdueBooks.length} items</span>
          </div>
          <div className="space-y-3">
            {overdueBooks.map((book, index) => (
              <div key={index} className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="font-medium text-gray-800">{book.title}</p>
                <p className="text-sm text-gray-600">{book.member}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Due: {book.dueDate}</span>
                  <span className="text-xs font-semibold text-red-600">{book.daysOverdue} days overdue</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/dashboard/book-transactions')}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
          >
            View All Overdue Books
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Quick Actions</h2>
          <button 
            onClick={() => navigate('/dashboard/reports')}
            className="flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            data-tooltip-id="export-tooltip"
            data-tooltip-content="Export detailed reports"
          >
            <FaDownload className="mr-2" />
            Export Report
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          <button 
            onClick={() => handleQuickAction('issue')}
            className="p-3 sm:p-4 lg:p-6 bg-white hover:bg-blue-50 rounded-xl shadow-lg text-center transition-all hover:scale-105 group"
            data-tooltip-id="issue-tooltip"
            data-tooltip-content="Issue book to member"
          >
            <FaPlus className="text-blue-600 text-lg sm:text-2xl lg:text-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs lg:text-sm font-medium text-gray-800">Issue Book</p>
          </button>
          <button 
            onClick={() => handleQuickAction('return')}
            className="p-3 sm:p-4 lg:p-6 bg-white hover:bg-green-50 rounded-xl shadow-lg text-center transition-all hover:scale-105 group"
          >
            <FaBook className="text-green-600 text-lg sm:text-2xl lg:text-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs lg:text-sm font-medium text-gray-800">Return Book</p>
          </button>
          <button 
            onClick={() => handleQuickAction('addMember')}
            className="p-3 sm:p-4 lg:p-6 bg-white hover:bg-purple-50 rounded-xl shadow-lg text-center transition-all hover:scale-105 group"
          >
            <FaUsers className="text-purple-600 text-lg sm:text-2xl lg:text-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs lg:text-sm font-medium text-gray-800">Add Member</p>
          </button>
          <button 
            onClick={() => handleQuickAction('addBook')}
            className="p-3 sm:p-4 lg:p-6 bg-white hover:bg-orange-50 rounded-xl shadow-lg text-center transition-all hover:scale-105 group"
          >
            <FaBook className="text-orange-600 text-lg sm:text-2xl lg:text-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs lg:text-sm font-medium text-gray-800">Add Book</p>
          </button>
          <button 
            onClick={() => handleQuickAction('reports')}
            className="p-3 sm:p-4 lg:p-6 bg-white hover:bg-red-50 rounded-xl shadow-lg text-center transition-all hover:scale-105 group"
          >
            <FaEye className="text-red-600 text-lg sm:text-2xl lg:text-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs lg:text-sm font-medium text-gray-800">View Reports</p>
          </button>
          <button 
            onClick={() => handleQuickAction('fine')}
            className="p-3 sm:p-4 lg:p-6 bg-white hover:bg-indigo-50 rounded-xl shadow-lg text-center transition-all hover:scale-105 group"
          >
            <FaCalendarAlt className="text-indigo-600 text-lg sm:text-2xl lg:text-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs lg:text-sm font-medium text-gray-800">Manage Fine</p>
          </button>
        </div>
      </div>

      {/* System Notifications Section - Updated */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800">Recent System Notifications</h2>
          <button 
            onClick={() => setShowNotifications(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All ({unreadCount} unread)
          </button>
        </div>
        <div className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div 
              key={notification.id}
              className={`flex items-center p-3 rounded border-l-4 ${
                notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                notification.type === 'error' ? 'bg-red-50 border-red-400' :
                notification.type === 'success' ? 'bg-green-50 border-green-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="mr-3">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Tooltips */}
      <Tooltip id="dashboard-search-tooltip" place="top" style={{ backgroundColor: '#374151', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="refresh-tooltip" place="top" style={{ backgroundColor: '#2563EB', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="notifications-tooltip" place="top" style={{ backgroundColor: '#F59E0B', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="export-tooltip" place="top" style={{ backgroundColor: '#059669', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="issue-tooltip" place="top" style={{ backgroundColor: '#2563EB', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
    </div>
  );
};

export default Dashboard;