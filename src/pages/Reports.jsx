import { useState, useEffect } from 'react';
import { FaSpinner, FaChartBar, FaBook, FaUsers, FaMoneyBillWave, FaExclamationTriangle, FaFilePdf, FaFileExcel, FaPrint, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

export const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('executive');
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [selectedReport, year]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token;

      if (!token) {
        toast.error('Please login first');
        setReportData(null);
        return;
      }

      let url = `${API_BASE_URL}/api/library-panel/reports/${selectedReport}`;
      if (selectedReport !== 'executive' && selectedReport !== 'inventory') {
        url += `?year=${year}`;
      }

      console.log('Fetching report from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Report data received:', result);
      setReportData(result.data || result);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to fetch report data: ' + error.message);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    toast.success(`Report exported as ${format} successfully!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  const renderExecutiveReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Books</p>
                <p className="text-3xl font-bold mt-2">{reportData.totalBooks?.toLocaleString() || 0}</p>
              </div>
              <FaBook className="text-4xl opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Members</p>
                <p className="text-3xl font-bold mt-2">{reportData.totalMembers?.toLocaleString() || 0}</p>
              </div>
              <FaUsers className="text-4xl opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Issues</p>
                <p className="text-3xl font-bold mt-2">{reportData.activeIssues?.toLocaleString() || 0}</p>
              </div>
              <FaChartBar className="text-4xl opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Overdue Books</p>
                <p className="text-3xl font-bold mt-2">{reportData.overdueBooks?.toLocaleString() || 0}</p>
              </div>
              <FaExclamationTriangle className="text-4xl opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-gray-600 text-sm">Book Utilization</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">{reportData.bookUtilization || 0}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${reportData.bookUtilization || 0}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-gray-600 text-sm">Total Fines</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">₹{reportData.totalFines?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-gray-600 text-sm">Monthly Issues</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">{reportData.monthlyIssues?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderCirculationReport = () => {
    if (!reportData?.categoryWise) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4">Category-wise Circulation</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reportData.categoryWise.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{item.category}</td>
                    <td className="px-6 py-4 text-blue-600 font-semibold">{item.issues}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">{item.returns}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderFinancialReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Collected Fine</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{reportData.collectedFine?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Pending Fine</p>
            <p className="text-3xl font-bold text-red-600 mt-2">₹{reportData.pendingFine?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Fine</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{reportData.totalFine?.toLocaleString() || 0}</p>
          </div>
        </div>

        {reportData.monthlyFines && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4">Monthly Fine Collection</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine Collection</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reportData.monthlyFines.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{item.month}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">₹{item.fineCollection?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInventoryReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Total Books</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{reportData.totalBooks?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Total Copies</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{reportData.totalCopies?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Total Value</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">₹{reportData.totalValue?.toLocaleString() || 0}</p>
          </div>
        </div>

        {reportData.categoryDistribution && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4">Category Distribution</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reportData.categoryDistribution.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-blue-600 font-semibold">{item.count}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">₹{item.value?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Library Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive library management insights with real-time data</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('PDF')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaFilePdf /> PDF
          </button>
          <button onClick={() => handleExport('Excel')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaFileExcel /> Excel
          </button>
          <button onClick={() => window.print()} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaPrint /> Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border mb-6 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2024, 2023, 2022, 2021].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        {selectedReport === 'executive' && renderExecutiveReport()}
        {selectedReport === 'circulation' && renderCirculationReport()}
        {selectedReport === 'financial' && renderFinancialReport()}
        {selectedReport === 'inventory' && renderInventoryReport()}
      </div>
    </div>
  );
};

export default Reports;
