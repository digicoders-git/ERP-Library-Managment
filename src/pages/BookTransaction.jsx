import { useState } from 'react';
import { FaPlus, FaUndo, FaSearch, FaFilter, FaBook, FaUser, FaCalendar, FaEye, FaExclamationTriangle } from 'react-icons/fa';

const BookTransaction = () => {
  const [books] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', availableCopies: 3 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', availableCopies: 0 },
    { id: 3, title: '1984', author: 'George Orwell', availableCopies: 4 },
  ]);

  const [members] = useState([
    { id: 'M001', name: 'John Doe', email: 'john@example.com' },
    { id: 'M002', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'M003', name: 'Alice Johnson', email: 'alice@example.com' },
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
      memberName: 'Alice Johnson',
      memberId: 'M003',
      issueDate: '2024-01-12',
      dueDate: '2024-01-26',
      returnDate: '2024-01-20',
      status: 'Returned',
      fine: 0
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    memberId: '',
    dueDate: ''
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateFine = (dueDate, returnDate = new Date()) => {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    const diffTime = returned - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 5 : 0; // ₹5 per day fine
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
  };

  const getOverdueTransactions = () => {
    const today = new Date();
    return transactions.filter(t => 
      t.status === 'Issued' && new Date(t.dueDate) < today
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Transactions</h1>
          <p className="text-gray-600">Manage book issues and returns</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowIssueModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" />
            Issue Book
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <FaBook className="text-blue-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Issued</p>
              <p className="text-xl font-bold">{transactions.filter(t => t.status === 'Issued').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <FaUndo className="text-green-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Returned</p>
              <p className="text-xl font-bold">{transactions.filter(t => t.status === 'Returned').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-xl font-bold">{getOverdueTransactions().length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <FaUser className="text-purple-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Fines</p>
              <p className="text-xl font-bold">₹{transactions.reduce((sum, t) => sum + t.fine, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by book title, member name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Issued">Issued</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const isOverdue = transaction.status === 'Issued' && new Date(transaction.dueDate) < new Date();
                return (
                  <tr key={transaction.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBook className="text-blue-500 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{transaction.bookTitle}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.memberName}</div>
                        <div className="text-sm text-gray-500">{transaction.memberId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.issueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                        {transaction.dueDate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.returnDate || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'Issued' 
                          ? isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {transaction.status === 'Issued' && isOverdue ? 'Overdue' : transaction.status}
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
                        >
                          <FaUndo />
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaEye />
                      </button>
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
              <h2 className="text-xl font-bold text-gray-800">Issue Book</h2>
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
              <h2 className="text-xl font-bold text-gray-800">Return Book</h2>
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
    </div>
  );
};

export default BookTransaction;