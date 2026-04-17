import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaBook, FaUser, FaCalendar, FaCheck, FaTimes, FaUndo, FaFilter, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { bookIssueAPI, bookAPI, memberAPI, studentAPI } from '../services/api';

const BookTransactions = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    memberId: '',
    memberType: 'LibraryMember',
    dueDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, membersRes, studentsRes, transactionsRes] = await Promise.all([
        bookAPI.getAll(),
        memberAPI.getAll(),
        studentAPI.getAll(),
        bookIssueAPI.getAll()
      ]);

      setBooks(booksRes.data.data || []);
      setMembers(membersRes.data.data || []);
      setStudents(studentsRes.data.data || []);
      setTransactions(transactionsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memberId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || transaction.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'returned') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  };

  const calculateFine = (dueDate, returnDate = new Date()) => {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    const diffTime = returned - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 5 : 0;
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    
    if (!issueForm.bookId || !issueForm.memberId || !issueForm.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bookId: issueForm.bookId,
        [issueForm.memberType === 'Student' ? 'studentId' : 'memberId']: issueForm.memberId,
        dueDate: issueForm.dueDate,
        issueDate: new Date().toISOString().split('T')[0]
      };

      const response = await bookIssueAPI.issue(payload);
      if (response.data.success || response.data.data) {
        toast.success('Book issued successfully!');
        setIssueForm({ bookId: '', memberId: '', memberType: 'LibraryMember', dueDate: '' });
        setShowIssueModal(false);
        await fetchData();
      }
    } catch (error) {
      console.error('Error issuing book:', error);
      toast.error(error.response?.data?.message || 'Failed to issue book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnBook = async (transaction) => {
    setSubmitting(true);
    try {
      const response = await bookIssueAPI.return(transaction._id, {
        returnDate: new Date().toISOString().split('T')[0]
      });
      if (response.data.success || response.data.data) {
        const fine = response.data.data?.fine || 0;
        toast.success(`Book returned successfully! ${fine > 0 ? `Fine: ₹${fine}` : ''}`);
        setShowReturnModal(false);
        await fetchData();
      }
    } catch (error) {
      console.error('Error returning book:', error);
      toast.error(error.response?.data?.message || 'Failed to return book');
    } finally {
      setSubmitting(false);
    }
  };

  const getOverdueTransactions = () => {
    const today = new Date();
    return transactions.filter(t => 
      t.status === 'issued' && new Date(t.dueDate) < today
    );
  };

  const getDisplayStatus = (transaction) => {
    if (transaction.status === 'issued' && isOverdue(transaction.dueDate, transaction.status)) {
      return 'Overdue';
    }
    return transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Book Transactions</h1>
          <p className="text-sm sm:text-base text-gray-600">Track book issues, returns, and manage library transactions</p>
        </div>
        <button 
          onClick={() => setShowIssueModal(true)}
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center cursor-pointer text-sm sm:text-base disabled:opacity-50"
          data-tooltip-id="issue-book-tooltip"
          data-tooltip-content="Issue book to member"
        >
          <FaPlus className="mr-2" />
          Issue Book
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaBook className="text-blue-600 text-sm sm:text-base" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm text-gray-600">Total Issued</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                {transactions.filter(t => t.status === 'issued').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheck className="text-green-600 text-sm sm:text-base" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm text-gray-600">Total Returned</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                {transactions.filter(t => t.status === 'returned').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaTimes className="text-red-600 text-sm sm:text-base" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm text-gray-600">Overdue</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                {getOverdueTransactions().length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaCalendar className="text-yellow-600 text-sm sm:text-base" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm text-gray-600">Total Fine</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                ₹{transactions.reduce((sum, t) => sum + (t.fine || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                data-tooltip-id="search-transactions-tooltip"
                data-tooltip-content="Search by book, member name or ID"
              />
              <input
                type="text"
                placeholder="Search by book title, member name, or member ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <FaFilter 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                data-tooltip-id="filter-status-tooltip"
                data-tooltip-content="Filter by transaction status"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="issued">Issued</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? filteredTransactions.map((transaction) => {
                const isTransactionOverdue = transaction.status === 'issued' && new Date(transaction.dueDate) < new Date();
                return (
                  <tr key={transaction._id} className={`hover:bg-gray-50 ${isTransactionOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaBook className="text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{transaction.bookTitle}</div>
                          <div className="text-sm text-gray-500">ID: {transaction.bookId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-gray-600 text-sm" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{transaction.memberName}</div>
                          <div className="text-sm text-gray-500">{transaction.memberId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.issueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${isTransactionOverdue ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                        {transaction.dueDate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.returnDate || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'issued' 
                          ? isTransactionOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          : getStatusColor(transaction.status)
                      }`}>
                        {getDisplayStatus(transaction)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{transaction.fine || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.status === 'issued' && (
                        <button 
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowReturnModal(true);
                          }}
                          disabled={submitting}
                          className="text-green-600 hover:text-green-900 mr-3 disabled:opacity-50"
                          data-tooltip-id="return-book-tooltip"
                          data-tooltip-content="Return this book"
                        >
                          <FaUndo />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Book Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowIssueModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Issue Book</h2>
                <button 
                  onClick={() => setShowIssueModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Close modal"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <form onSubmit={handleIssueBook} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Type</label>
                <select
                  value={issueForm.memberType}
                  onChange={(e) => setIssueForm({...issueForm, memberType: e.target.value, memberId: ''})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LibraryMember">Library Member</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Book</label>
                <select
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({...issueForm, bookId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a book...</option>
                  {books.filter(book => book.availableCopies > 0).map(book => (
                    <option key={book._id} value={book._id}>
                      {book.title} - {book.author} (Available: {book.availableCopies})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select {issueForm.memberType === 'Student' ? 'Student' : 'Member'}</label>
                <select
                  value={issueForm.memberId}
                  onChange={(e) => setIssueForm({...issueForm, memberId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a {issueForm.memberType === 'Student' ? 'student' : 'member'}...</option>
                  {issueForm.memberType === 'Student' 
                    ? students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.firstName} {student.lastName} ({student.admissionNumber || student.rollNumber})
                        </option>
                      ))
                    : members.map(member => (
                        <option key={member._id} value={member._id}>
                          {member.name} ({member.memberId})
                        </option>
                      ))
                  }
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={issueForm.dueDate}
                  onChange={(e) => setIssueForm({...issueForm, dueDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : null}
                  Issue Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Book Modal */}
      {showReturnModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowReturnModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Return Book</h2>
                <button 
                  onClick={() => setShowReturnModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Close modal"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Book: <span className="font-medium">{selectedTransaction.bookTitle}</span></p>
                <p className="text-sm text-gray-600">Member: <span className="font-medium">{selectedTransaction.memberName}</span></p>
                <p className="text-sm text-gray-600">Due Date: <span className="font-medium">{selectedTransaction.dueDate}</span></p>
              </div>
              {calculateFine(selectedTransaction.dueDate) > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">
                    Fine: ₹{calculateFine(selectedTransaction.dueDate)}
                  </p>
                  <p className="text-red-600 text-sm">
                    Book is {Math.ceil((new Date() - new Date(selectedTransaction.dueDate)) / (1000 * 60 * 60 * 24))} days overdue
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReturnModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReturnBook(selectedTransaction)}
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : null}
                  Return Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Tooltips */}
      <Tooltip id="issue-book-tooltip" place="top" style={{ backgroundColor: '#059669', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="search-transactions-tooltip" place="top" style={{ backgroundColor: '#374151', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="filter-status-tooltip" place="top" style={{ backgroundColor: '#6B7280', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="return-book-tooltip" place="top" style={{ backgroundColor: '#059669', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
    </div>
  );
};

export default BookTransactions;
