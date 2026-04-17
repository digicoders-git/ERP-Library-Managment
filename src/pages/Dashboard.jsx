import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaUsers, FaUserGraduate, FaClipboardList, FaArrowUp, FaArrowDown, FaPlus, FaEye, FaCalendarAlt, FaExclamationTriangle, FaSearch, FaBell, FaSyncAlt, FaClock, FaMoneyBillWave, FaChartLine, FaArrowUp as FaArrowTrendUp } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState([
    { title: 'Total Books', value: '0', icon: FaBook, color: 'bg-blue-500', change: '0%', trend: 'up', description: 'Loading...' },
    { title: 'Active Members', value: '0', icon: FaUsers, color: 'bg-green-500', change: '0%', trend: 'up', description: 'Loading...' },
    { title: 'Students', value: '0', icon: FaUserGraduate, color: 'bg-purple-500', change: '0%', trend: 'up', description: 'Loading...' },
    { title: 'Books Issued', value: '0', icon: FaClipboardList, color: 'bg-orange-500', change: '0%', trend: 'down', description: 'Loading...' },
  ]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [todayStats, setTodayStats] = useState({
    issued: 0,
    returned: 0,
    newMembers: 0,
    fineCollected: 0
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      if (response.data.success) {
        const data = response.data.data;
        setStats([
          { title: 'Total Books', value: data.totalBooks.toString(), icon: FaBook, color: 'bg-blue-500', change: '+12%', trend: 'up', description: `Available: ${data.availableBooks}` },
          { title: 'Active Members', value: data.totalMembers.toString(), icon: FaUsers, color: 'bg-green-500', change: '+8%', trend: 'up', description: 'Active members' },
          { title: 'Students', value: data.totalStudents.toString(), icon: FaUserGraduate, color: 'bg-purple-500', change: '+5%', trend: 'up', description: 'Registered students' },
          { title: 'Books Issued', value: data.issuedBooks.toString(), icon: FaClipboardList, color: 'bg-orange-500', change: '-3%', trend: 'down', description: `Overdue: ${data.overdueBooks}` },
        ]);
        setTodayStats({
          issued: data.todayIssued,
          returned: data.todayReturned,
          newMembers: 0,
          fineCollected: data.totalFine
        });
      }
      
      const activitiesRes = await dashboardAPI.getRecentActivities();
      if (activitiesRes.data.success) {
        setRecentActivities(activitiesRes.data.data || []);
      }
      
      const overdueRes = await dashboardAPI.getOverdueBooks();
      if (overdueRes.data.success) {
        setOverdueBooks(overdueRes.data.data || []);
      }
      
      const popularRes = await dashboardAPI.getPopularBooks();
      if (popularRes.data.success) {
        setPopularBooks(popularRes.data.data || []);
      }
    } catch (error) {
      console.log('Dashboard API error:', error);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchDashboardData();
      toast.success('Dashboard refreshed!');
    } catch (error) {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'issue': navigate('/dashboard/book-transactions'); break;
      case 'return': navigate('/dashboard/book-transactions'); break;
      case 'addMember': navigate('/dashboard/members'); break;
      case 'addBook': navigate('/dashboard/books'); break;
      case 'reports': navigate('/dashboard/reports'); break;
      default: break;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-6 bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's your library management system.</p>
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
              <FaSearch className="absolute left-2 top-3 text-gray-400 text-xs" />
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSyncAlt className={isLoading ? 'animate-spin' : ''} />
            </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 ${activity.type === 'issue' ? 'bg-blue-500' : 'bg-green-500'} rounded-full mr-3`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.details}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">No recent activities</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Popular Books</h2>
          <div className="space-y-3">
            {popularBooks.length > 0 ? popularBooks.slice(0, 5).map((book, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{book.title}</p>
                  <p className="text-xs text-gray-600">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{book.issued}</p>
                  <p className="text-xs text-gray-500">issued</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">Overdue Books</h2>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{overdueBooks.length}</span>
          </div>
          <div className="space-y-3">
            {overdueBooks.length > 0 ? overdueBooks.slice(0, 5).map((book, index) => (
              <div key={index} className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="font-medium text-gray-800 text-sm">{book.title}</p>
                <p className="text-xs text-gray-600">{book.member}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Due: {book.dueDate}</span>
                  <span className="text-xs font-semibold text-red-600">{book.daysOverdue} days</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">No overdue books</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 mb-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Today's Summary</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <FaClipboardList className="text-blue-600 mr-3" />
              <span className="font-medium text-gray-800 text-sm">Issued</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{todayStats.issued}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <FaBook className="text-green-600 mr-3" />
              <span className="font-medium text-gray-800 text-sm">Returned</span>
            </div>
            <span className="text-xl font-bold text-green-600">{todayStats.returned}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center">
              <FaUsers className="text-purple-600 mr-3" />
              <span className="font-medium text-gray-800 text-sm">Members</span>
            </div>
            <span className="text-xl font-bold text-purple-600">{todayStats.newMembers}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-red-600 mr-3" />
              <span className="font-medium text-gray-800 text-sm">Fine</span>
            </div>
            <span className="text-xl font-bold text-red-600">₹{todayStats.fineCollected}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          <button 
            onClick={() => handleQuickAction('issue')}
            className="p-3 sm:p-4 lg:p-6 bg-white hover:bg-blue-50 rounded-xl shadow-lg text-center transition-all hover:scale-105 group"
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
            onClick={() => navigate('/dashboard/book-transactions')}
            className="p-3 sm:p-4 lg:p-6 bg-white hover:bg-indigo-50 rounded-xl shadow-lg text-center transition-all hover:scale-105 group"
          >
            <FaCalendarAlt className="text-indigo-600 text-lg sm:text-2xl lg:text-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs lg:text-sm font-medium text-gray-800">Transactions</p>
          </button>
        </div>
      </div>

      <Tooltip id="dashboard-search-tooltip" place="top" style={{ backgroundColor: '#374151', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="refresh-tooltip" place="top" style={{ backgroundColor: '#2563EB', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
    </div>
  );
};

export default Dashboard;
