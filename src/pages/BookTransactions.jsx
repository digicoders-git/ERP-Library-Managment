import { useState } from 'react';
import { FaPlus, FaSearch, FaBook, FaUser, FaCalendar, FaCheck, FaTimes, FaUndo, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

const BookTransactions = () => {
  const [books] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', availableCopies: 3 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', availableCopies: 0 },
    { id: 3, title: '1984', author: 'George Orwell', availableCopies: 4 },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', availableCopies: 2 },
  ]);

  const [members] = useState([
    { id: 'M001', name: 'John Doe', email: 'john@example.com' },
    { id: 'M002', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'M003', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'M004', name: 'Bob Wilson', email: 'bob@example.com' },
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      bookId: 1,
      bookTitle: 'The Great Gatsby',
      memberName: 'John Doe',
      memberId: 'M001',
      issueDate: '2024-01-15',
      dueDate: '2024-01-29',
      returnDate: null,
      status: 'Issued',
      fine: 0
    },
    {
      id: 2,
      bookId: 2,
      bookTitle: 'To Kill a Mockingbird',
      memberName: 'Jane Smith',
      memberId: 'M002',
      issueDate: '2024-01-10',
      dueDate: '2024-01-24',
      returnDate: '2024-01-20',
      status: 'Returned',
      fine: 0
    },
    {
      id: 3,
      bookId: 3,
      bookTitle: '1984',
      memberName: 'Alice Johnson',
      memberId: 'M003',
      issueDate: '2024-01-12',
      dueDate: '2024-01-26',
      returnDate: null,
      status: 'Overdue',
      fine: 50
    },
    {
      id: 4,
      bookId: 4,
      bookTitle: 'Pride and Prejudice',
      memberName: 'Bob Wilson',
      memberId: 'M004',
      issueDate: '2024-01-18',
      dueDate: '2024-02-01',
      returnDate: null,
      status: 'Issued',
      fine: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    memberId: '',
    dueDate: ''
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || transaction.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Issued':
        return 'bg-blue-100 text-blue-800';
      case 'Returned':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'Returned') return false;
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

  const handleIssueBook = (e) => {
    e.preventDefault();
    const book = books.find(b => b.id === parseInt(issueForm.bookId));
    const member = members.find(m => m.id === issueForm.memberId);
    
    if (book && member && book.availableCopies > 0) {
      const newTransaction = {
        id: transactions.length + 1,
        bookId: book.id,
        bookTitle: book.title,
        memberName: member.name,
        memberId: member.id,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: issueForm.dueDate,
        returnDate: null,
        status: 'Issued',
        fine: 0
      };
      
      setTransactions([...transactions, newTransaction]);
      setIssueForm({ bookId: '', memberId: '', dueDate: '' });
      setShowIssueModal(false);
      toast.success('Book issued successfully!');
    }
  };

  const handleReturnBook = (transaction) => {
    const returnDate = new Date().toISOString().split('T')[0];
    const fine = calculateFine(transaction.dueDate, returnDate);
    
    setTransactions(transactions.map(t => 
      t.id === transaction.id 
        ? { ...t, returnDate, status: 'Returned', fine }
        : t
    ));
    setShowReturnModal(false);
    toast.success(`Book returned successfully! ${fine > 0 ? `Fine: ₹${fine}` : ''}`);
  };

  const getOverdueTransactions = () => {
    const today = new Date();
    return transactions.filter(t => 
      t.status === 'Issued' && new Date(t.dueDate) < today
    );
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Book Transactions</h1>
          <p className="text-sm sm:text-base text-gray-600">Track book issues, returns, and manage library transactions</p>
        </div>
        <button 
          onClick={() => setShowIssueModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center cursor-pointer text-sm sm:text-base"
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
                {transactions.filter(t => t.status === 'Issued').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheck className="text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Returned</p>
              <p className="text-xl font-bold text-gray-800">
                {transactions.filter(t => t.status === 'Returned').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaTimes className="text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-xl font-bold text-gray-800">
                {getOverdueTransactions().length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaCalendar className="text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Fine</p>
              <p className="text-xl font-bold text-gray-800">
                ₹{transactions.reduce((sum, t) => sum + t.fine, 0)}
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
                <option value="Issued">Issued</option>
                <option value="Returned">Returned</option>
                <option value="Overdue">Overdue</option>
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
              {filteredTransactions.map((transaction) => {
                const isTransactionOverdue = transaction.status === 'Issued' && new Date(transaction.dueDate) < new Date();
                return (
                  <tr key={transaction.id} className={`hover:bg-gray-50 ${isTransactionOverdue ? 'bg-red-50' : ''}`}>
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
                        transaction.status === 'Issued' 
                          ? isTransactionOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          : getStatusColor(transaction.status)
                      }`}>
                        {transaction.status === 'Issued' && isTransactionOverdue ? 'Overdue' : transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{transaction.fine}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.status === 'Issued' && (
                        <button 
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowReturnModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 mr-3"
                          data-tooltip-id="return-book-tooltip"
                          data-tooltip-content="Return this book"
                        >
                          <FaUndo />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Book Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Issue Book</h2>
                <button 
                  onClick={() => setShowIssueModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <form onSubmit={handleIssueBook} className="p-6">
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
                    <option key={book.id} value={book.id}>
                      {book.title} - {book.author} (Available: {book.availableCopies})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Member</label>
                <select
                  value={issueForm.memberId}
                  onChange={(e) => setIssueForm({...issueForm, memberId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a member...</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.id})
                    </option>
                  ))}
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
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Issue Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Book Modal */}
      {showReturnModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Return Book</h2>
                <button 
                  onClick={() => setShowReturnModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReturnBook(selectedTransaction)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
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