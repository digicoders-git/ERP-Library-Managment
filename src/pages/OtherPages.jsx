import { useState } from 'react';
import { FaClipboardList, FaChartBar, FaCog, FaDownload, FaCalendarAlt, FaBook, FaUsers, FaUserGraduate, FaExclamationTriangle, FaMoneyBillWave, FaFilter, FaArrowUp, FaArrowDown, FaEye, FaPrint, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const Transactions = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction Management</h2>
      <p className="text-gray-600">Track book issues, returns, and transaction history.</p>
    </div>
  </div>
);

export const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('executive');
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Enhanced sample data for high-level reports
  const reportData = {
    executive: {
      totalBooks: 2847,
      totalMembers: 1245,
      totalStudents: 3420,
      activeIssues: 428,
      overdueBooks: 67,
      totalFines: 12450,
      monthlyIssues: 1285,
      monthlyReturns: 1172,
      membershipGrowth: 15.2,
      bookUtilization: 78.5,
      averageIssueTime: 12.3,
      popularityIndex: 92.1,
      revenueGenerated: 45600,
      operationalEfficiency: 89.7
    },
    circulation: {
      dailyAverage: 45,
      weeklyTrend: [42, 48, 51, 39, 55, 62, 38],
      monthlyData: [1285, 1172, 1398, 1156, 1445, 1289, 1367, 1423, 1298, 1534, 1389, 1456],
      peakHours: ['10:00-11:00', '14:00-15:00', '16:00-17:00'],
      categoryWise: [
        { category: 'Fiction', issues: 456, returns: 423, percentage: 35.5 },
        { category: 'Academic', issues: 389, returns: 367, percentage: 30.3 },
        { category: 'Science', issues: 234, returns: 221, percentage: 18.2 },
        { category: 'History', issues: 156, returns: 145, percentage: 12.1 },
        { category: 'Others', issues: 89, returns: 82, percentage: 6.9 }
      ]
    },
    financial: {
      totalRevenue: 45600,
      fineCollection: 12450,
      membershipFees: 28900,
      otherCharges: 4250,
      monthlyRevenue: [3200, 3800, 4100, 3600, 4500, 3900, 4200, 4300, 3800, 4600, 4100, 4400],
      expenses: {
        bookPurchase: 18500,
        maintenance: 5600,
        staff: 15200,
        utilities: 3400,
        others: 2800
      },
      profitMargin: 28.5
    },
    inventory: {
      totalBooks: 2847,
      newAcquisitions: 156,
      booksRetired: 23,
      damagedBooks: 12,
      lostBooks: 8,
      categoryDistribution: [
        { name: 'Fiction', count: 1012, percentage: 35.5, value: 156800 },
        { name: 'Academic', count: 854, percentage: 30.0, value: 234500 },
        { name: 'Science', count: 512, percentage: 18.0, value: 189200 },
        { name: 'History', count: 298, percentage: 10.5, value: 98400 },
        { name: 'Others', count: 171, percentage: 6.0, value: 45600 }
      ],
      topPerformers: [
        { title: 'Advanced Programming', issues: 89, rating: 4.8 },
        { title: 'Data Science Handbook', issues: 76, rating: 4.7 },
        { title: 'Modern Physics', issues: 68, rating: 4.6 },
        { title: 'World History', issues: 62, rating: 4.5 },
        { title: 'Literary Classics', issues: 58, rating: 4.4 }
      ]
    }
  };

  const handleExportReport = (type, format) => {
    toast.success(`${selectedReport.toUpperCase()} report exported as ${format} successfully!`);
  };

  // Enhanced Chart Components with animations and gradients
  const PieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="w-full h-96 flex flex-col items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl opacity-30"></div>
        <h3 className="text-xl font-bold mb-6 text-gray-800 relative z-10">{title}</h3>
        <div className="relative w-72 h-72 z-10">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
            <defs>
              {data.map((_, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={`hsl(${index * 60}, 80%, 60%)`} />
                  <stop offset="100%" stopColor={`hsl(${index * 60}, 70%, 45%)`} />
                </linearGradient>
              ))}
            </defs>
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="15.915"
                  fill="transparent"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out hover:stroke-[12] cursor-pointer"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                    animation: `drawCircle 2s ease-out ${index * 0.2}s both`
                  }}
                />
              );
            })}
            <circle cx="50" cy="50" r="8" fill="white" className="drop-shadow-md" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm relative z-10">
          {data.map((item, index) => (
            <div key={index} className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm hover:shadow-md transition-all">
              <div 
                className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                style={{background: `linear-gradient(135deg, hsl(${index * 60}, 80%, 60%), hsl(${index * 60}, 70%, 45%))`}}
              ></div>
              <div>
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-xs text-gray-500">{item.value} ({((item.value/total)*100).toFixed(1)}%)</div>
              </div>
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes drawCircle {
            from { stroke-dasharray: 0 100; }
            to { stroke-dasharray: var(--final-dash); }
          }
        `}</style>
      </div>
    );
  };

  const LineChart = ({ data, title, labels }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 320;
      const y = 180 - ((value - minValue) / range) * 160;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full h-96 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl opacity-40"></div>
        <div className="relative z-10 p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">{title}</h3>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <svg className="w-full h-64" viewBox="0 0 320 180">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="0" y1={i * 45} x2="320" y2={i * 45} stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
              ))}
              
              {/* Area under curve */}
              <path
                d={`M 0,180 L ${points} L 320,180 Z`}
                fill="url(#areaGradient)"
                className="animate-pulse"
              />
              
              {/* Main line */}
              <polyline
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                points={points}
                className="drop-shadow-sm"
                style={{
                  strokeDasharray: '1000',
                  strokeDashoffset: '1000',
                  animation: 'drawLine 2s ease-out forwards'
                }}
              />
              
              {/* Data points */}
              {data.map((value, index) => {
                const x = (index / (data.length - 1)) * 320;
                const y = 180 - ((value - minValue) / range) * 160;
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="white"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      className="drop-shadow-md hover:r-8 transition-all cursor-pointer"
                      style={{
                        animation: `popIn 0.5s ease-out ${index * 0.1}s both`
                      }}
                    />
                    <text x={x} y={y-15} textAnchor="middle" className="text-xs font-semibold fill-gray-700">
                      {value}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between text-xs mt-3 px-4">
            {labels.map((label, index) => (
              <span key={index} className="font-medium text-gray-600 bg-white/70 px-2 py-1 rounded">{label}</span>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes drawLine {
            to { stroke-dashoffset: 0; }
          }
          @keyframes popIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  };

  const BarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="w-full h-96 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl opacity-40"></div>
        <div className="relative z-10 p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">{title}</h3>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="space-y-4">
              {data.map((item, index) => (
                <div key={index} className="group hover:bg-white/50 p-2 rounded-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-700 truncate flex-1 mr-3">{item.name}</div>
                    <div className="text-sm font-bold text-gray-800 bg-white/80 px-2 py-1 rounded">{item.value}</div>
                  </div>
                  <div className="relative">
                    <div className="bg-gray-200 rounded-full h-6 shadow-inner">
                      <div 
                        className="h-6 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden" 
                        style={{
                          width: `${(item.value / maxValue) * 100}%`,
                          background: `linear-gradient(90deg, hsl(${index * 45}, 70%, 55%), hsl(${index * 45}, 80%, 65%))`,
                          animation: `fillBar 1.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-bold text-white drop-shadow">
                          {((item.value / maxValue) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes fillBar {
            from { width: 0%; }
            to { width: var(--final-width); }
          }
        `}</style>
      </div>
    );
  };

  const renderExecutiveReport = () => (
    <div className="space-y-6">
      {/* KPI Cards with enhanced animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Collection</p>
                <p className="text-4xl font-bold mt-2 animate-pulse">{reportData.executive.totalBooks.toLocaleString()}</p>
                <p className="text-blue-100 text-xs mt-1">📚 Books in catalog</p>
              </div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <FaBook className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-6 rounded-2xl text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Members</p>
                <p className="text-4xl font-bold mt-2">{reportData.executive.totalMembers.toLocaleString()}</p>
                <p className="text-green-100 text-xs mt-1 flex items-center">
                  <FaArrowUp className="mr-1 animate-bounce" /> +{reportData.executive.membershipGrowth}% growth 📈
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <FaUsers className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 p-6 rounded-2xl text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Revenue Generated</p>
                <p className="text-4xl font-bold mt-2">₹{reportData.executive.revenueGenerated.toLocaleString()}</p>
                <p className="text-purple-100 text-xs mt-1">💰 This fiscal year</p>
              </div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <FaMoneyBillWave className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 p-6 rounded-2xl text-white shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Utilization Rate</p>
                <p className="text-4xl font-bold mt-2">{reportData.executive.bookUtilization}%</p>
                <p className="text-orange-100 text-xs mt-1">⚡ Operational efficiency</p>
              </div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <FaChartBar className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
          <div className="p-2">
            <PieChart 
              data={reportData.circulation.categoryWise.map(item => ({
                name: item.category,
                value: item.issues
              }))}
              title="📊 Category Distribution"
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
          <div className="p-2">
            <LineChart 
              data={reportData.circulation.monthlyData}
              title="📈 Monthly Circulation Trends"
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCirculationReport = () => (
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-6">
            <LineChart 
              data={reportData.circulation.monthlyData}
              title="Circulation Trends"
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-6">
            <PieChart 
              data={reportData.circulation.categoryWise.map(item => ({
                name: item.category,
                value: item.percentage
              }))}
              title="Category Breakdown"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Circulation Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returns</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData.circulation.categoryWise.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">{item.issues}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">{item.returns}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${item.percentage}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.percentage > 30 ? 'bg-green-100 text-green-800' : 
                      item.percentage > 15 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.percentage > 30 ? 'High' : item.percentage > 15 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-6">
            <BarChart 
              data={reportData.financial.monthlyRevenue.map((value, index) => ({
                name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
                value: value
              }))}
              title="Monthly Revenue"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-6">
            <PieChart 
              data={Object.entries(reportData.financial.expenses).map(([key, value]) => ({
                name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                value: value
              }))}
              title="Expense Distribution"
            />
          </div>
        </div>
      </div>

      {/* Financial Summary Table */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Financial Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Membership Fees</td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">₹{reportData.financial.membershipFees.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">63.4%</td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600"><FaArrowUp className="inline" /> +12%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Fine Collection</td>
                <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">₹{reportData.financial.fineCollection.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">27.3%</td>
                <td className="px-6 py-4 whitespace-nowrap text-red-600"><FaArrowDown className="inline" /> -5%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Other Charges</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-bold">₹{reportData.financial.otherCharges.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">9.3%</td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600"><FaArrowUp className="inline" /> +8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventoryReport = () => (
    <div className="space-y-6">
      {/* Inventory Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-6">
            <PieChart 
              data={reportData.inventory.categoryDistribution.map(item => ({
                name: item.name,
                value: item.count
              }))}
              title="Collection Distribution"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-6">
            <BarChart 
              data={reportData.inventory.topPerformers.map(book => ({
                name: book.title,
                value: book.issues
              }))}
              title="Top Performing Books"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Inventory Report</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Books Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData.inventory.categoryDistribution.map((category, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">{category.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">₹{category.value.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{width: `${category.percentage}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{category.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Executive Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive library management insights with interactive charts</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleExportReport(selectedReport, 'PDF')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaFilePdf className="mr-2" />
            Export PDF
          </button>
          <button 
            onClick={() => handleExportReport(selectedReport, 'Excel')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaFileExcel className="mr-2" />
            Export Excel
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPrint className="mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="bg-white rounded-lg shadow border mb-6">
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select 
                value={selectedReport} 
                onChange={(e) => setSelectedReport(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="executive">Executive Dashboard</option>
                <option value="circulation">Circulation Analysis</option>
                <option value="financial">Financial Report</option>
                <option value="inventory">Inventory Management</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-400" />
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="date" 
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input 
                type="date" 
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div>
        {selectedReport === 'executive' && renderExecutiveReport()}
        {selectedReport === 'circulation' && renderCirculationReport()}
        {selectedReport === 'financial' && renderFinancialReport()}
        {selectedReport === 'inventory' && renderInventoryReport()}
      </div>
    </div>
  );
};

export const Settings = () => {
  const [settings, setSettings] = useState({
    libraryName: 'Central Library System',
    maxBooksPerMember: 3,
    loanPeriodDays: 14,
    finePerDay: 5,
    maxRenewalTimes: 2,
    emailNotifications: true,
    smsNotifications: false,
    autoReminders: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure library system preferences and policies</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Library Configuration */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaCog className="mr-2" />
              Library Configuration
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Library Name</label>
              <input 
                type="text" 
                value={settings.libraryName}
                onChange={(e) => handleSettingChange('libraryName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Books Per Member</label>
              <input 
                type="number" 
                value={settings.maxBooksPerMember}
                onChange={(e) => handleSettingChange('maxBooksPerMember', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Period (Days)</label>
              <input 
                type="number" 
                value={settings.loanPeriodDays}
                onChange={(e) => handleSettingChange('loanPeriodDays', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fine Per Day (₹)</label>
              <input 
                type="number" 
                value={settings.finePerDay}
                onChange={(e) => handleSettingChange('finePerDay', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Notification Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <input 
                type="checkbox" 
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
              <input 
                type="checkbox" 
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Auto Reminders</label>
              <input 
                type="checkbox" 
                checked={settings.autoReminders}
                onChange={(e) => handleSettingChange('autoReminders', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Renewal Times</label>
              <input 
                type="number" 
                value={settings.maxRenewalTimes}
                onChange={(e) => handleSettingChange('maxRenewalTimes', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};