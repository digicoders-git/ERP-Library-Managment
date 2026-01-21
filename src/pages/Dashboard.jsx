import { FaBook, FaUsers, FaUserGraduate, FaClipboardList, FaArrowUp, FaArrowDown, FaPlus, FaEye, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';

const Dashboard = () => {
  const stats = [
    { title: 'Total Books', value: '2,547', icon: FaBook, color: 'bg-blue-500', change: '+12%', trend: 'up' },
    { title: 'Active Members', value: '1,234', icon: FaUsers, color: 'bg-green-500', change: '+8%', trend: 'up' },
    { title: 'Students', value: '987', icon: FaUserGraduate, color: 'bg-purple-500', change: '+5%', trend: 'up' },
    { title: 'Books Issued', value: '456', icon: FaClipboardList, color: 'bg-orange-500', change: '-3%', trend: 'down' },
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

  const todayStats = {
    issued: 12,
    returned: 8,
    newMembers: 3,
    fineCollected: 250
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in your library today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? FaArrowUp : FaArrowDown;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="text-white text-xl" />
                </div>
                <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
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

        {/* Today's Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Summary</h2>
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
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Overdue Books</h2>
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
          <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm cursor-pointer">
            View All Overdue Books
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button className="p-6 bg-white hover:bg-blue-50 rounded-xl shadow-lg border border-gray-100 text-center transition-all hover:scale-105 cursor-pointer">
            <FaPlus className="text-blue-600 text-3xl mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-800">Issue Book</p>
          </button>
          <button className="p-6 bg-white hover:bg-green-50 rounded-xl shadow-lg border border-gray-100 text-center transition-all hover:scale-105 cursor-pointer">
            <FaBook className="text-green-600 text-3xl mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-800">Return Book</p>
          </button>
          <button className="p-6 bg-white hover:bg-purple-50 rounded-xl shadow-lg border border-gray-100 text-center transition-all hover:scale-105 cursor-pointer">
            <FaUsers className="text-purple-600 text-3xl mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-800">Add Member</p>
          </button>
          <button className="p-6 bg-white hover:bg-orange-50 rounded-xl shadow-lg border border-gray-100 text-center transition-all hover:scale-105 cursor-pointer">
            <FaBook className="text-orange-600 text-3xl mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-800">Add Book</p>
          </button>
          <button className="p-6 bg-white hover:bg-red-50 rounded-xl shadow-lg border border-gray-100 text-center transition-all hover:scale-105 cursor-pointer">
            <FaEye className="text-red-600 text-3xl mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-800">View Reports</p>
          </button>
          <button className="p-6 bg-white hover:bg-indigo-50 rounded-xl shadow-lg border border-gray-100 text-center transition-all hover:scale-105 cursor-pointer">
            <FaCalendarAlt className="text-indigo-600 text-3xl mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-800">Manage Fine</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;