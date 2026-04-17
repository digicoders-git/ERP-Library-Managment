import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { barcodeFineAPI } from '../services/api';

export default function FineManagement() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const { data } = await barcodeFineAPI.getFines();
      setFines(data.data || data || []);
    } catch (error) {
      console.error('Error fetching fines:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch fines');
      setFines([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFine = async (id) => {
    try {
      setSubmitting(true);
      await barcodeFineAPI.payFine(id);
      toast.success('Fine marked as paid successfully');
      await fetchFines();
    } catch (error) {
      console.error('Error paying fine:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWaiveFine = async (id) => {
    if (!window.confirm('Are you sure you want to waive this fine?')) return;
    try {
      setSubmitting(true);
      await barcodeFineAPI.waiveFine(id);
      toast.success('Fine waived successfully');
      await fetchFines();
    } catch (error) {
      console.error('Error waiving fine:', error);
      toast.error(error.response?.data?.message || 'Failed to waive fine');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter fines based on status and search term
  const filteredFines = fines.filter(fine => {
    const matchesSearch = 
      fine.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || fine.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalFines = filteredFines.reduce((sum, fine) => sum + (fine.amount || 0), 0);
  const paidFines = filteredFines.filter(f => f.status === 'paid').reduce((sum, fine) => sum + (fine.amount || 0), 0);
  const pendingFines = filteredFines.filter(f => f.status === 'pending').reduce((sum, fine) => sum + (fine.amount || 0), 0);
  const waivedFines = filteredFines.filter(f => f.status === 'waived').reduce((sum, fine) => sum + (fine.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading fines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Fine Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm">Total Fines</p>
          <p className="text-3xl font-bold text-gray-800">₹{totalFines}</p>
          <p className="text-xs text-gray-500 mt-2">{filteredFines.length} records</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm">Paid Fines</p>
          <p className="text-3xl font-bold text-green-600">₹{paidFines}</p>
          <p className="text-xs text-gray-500 mt-2">{filteredFines.filter(f => f.status === 'paid').length} paid</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
          <p className="text-gray-600 text-sm">Pending Fines</p>
          <p className="text-3xl font-bold text-red-600">₹{pendingFines}</p>
          <p className="text-xs text-gray-500 mt-2">{filteredFines.filter(f => f.status === 'pending').length} pending</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
          <p className="text-gray-600 text-sm">Waived Fines</p>
          <p className="text-3xl font-bold text-yellow-600">₹{waivedFines}</p>
          <p className="text-xs text-gray-500 mt-2">{filteredFines.filter(f => f.status === 'waived').length} waived</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition ${filter === 'pending' ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg transition ${filter === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Paid
          </button>
          <button
            onClick={() => setFilter('waived')}
            className={`px-4 py-2 rounded-lg transition ${filter === 'waived' ? 'bg-yellow-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Waived
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by student name, ID, or book..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fines Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredFines.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No fines found</p>
            <p className="text-sm mt-2">All fines are up to date!</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFines.map((fine) => (
                <tr key={fine._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{fine.studentName}</div>
                    <div className="text-sm text-gray-500">{fine.studentId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{fine.bookTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(fine.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                    {fine.daysOverdue} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ₹{fine.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      fine.status === 'paid' ? 'bg-green-100 text-green-800' :
                      fine.status === 'waived' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {fine.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePayFine(fine._id)}
                          disabled={submitting}
                          className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => handleWaiveFine(fine._id)}
                          disabled={submitting}
                          className="text-yellow-600 hover:text-yellow-900 font-medium disabled:opacity-50"
                        >
                          Waive
                        </button>
                      </div>
                    )}
                    {fine.status !== 'pending' && (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
