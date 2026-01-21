import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBook, FaHistory, FaEye, FaTimes, FaChevronLeft, FaChevronRight, FaBarcode, FaQrcode, FaCalculator } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Books = () => {
  const [books, setBooks] = useState([
    { 
      id: 1, 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      isbn: '978-0-7432-7356-5',
      barcode: 'BC001234567890',
      rfidTag: 'RFID001234567890', 
      category: 'Fiction', 
      publisher: 'Scribner',
      publicationYear: 1925,
      pages: 180,
      language: 'English',
      location: 'A-1-001',
      status: 'Available',
      totalCopies: 5,
      availableCopies: 3,
      issuedCopies: 2,
      reservedCopies: 0,
      condition: 'Good',
      price: 299.99,
      addedDate: '2024-01-01'
    },
    { 
      id: 2, 
      title: 'To Kill a Mockingbird', 
      author: 'Harper Lee', 
      isbn: '978-0-06-112008-4',
      barcode: 'BC001234567891',
      rfidTag: 'RFID001234567891',
      category: 'Fiction', 
      publisher: 'J.B. Lippincott & Co.',
      publicationYear: 1960,
      pages: 281,
      language: 'English',
      location: 'A-1-002',
      status: 'Issued',
      totalCopies: 3,
      availableCopies: 0,
      issuedCopies: 3,
      reservedCopies: 0,
      condition: 'Excellent',
      price: 349.99,
      addedDate: '2024-01-02'
    },
    { 
      id: 3, 
      title: '1984', 
      author: 'George Orwell', 
      isbn: '978-0-452-28423-4',
      barcode: 'BC001234567892',
      rfidTag: 'RFID001234567892',
      category: 'Dystopian', 
      publisher: 'Secker & Warburg',
      publicationYear: 1949,
      pages: 328,
      language: 'English',
      location: 'A-1-003',
      status: 'Available',
      totalCopies: 4,
      availableCopies: 4,
      issuedCopies: 0,
      reservedCopies: 0,
      condition: 'Good',
      price: 279.99,
      addedDate: '2024-01-03'
    },
  ]);

  const [transactions] = useState([
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
      fineAmount: 0,
      renewalCount: 0,
      issueMethod: 'Barcode'
    },
    {
      id: 2,
      bookId: 1,
      bookTitle: 'The Great Gatsby',
      memberName: 'Jane Smith',
      memberId: 'M002',
      issueDate: '2024-01-10',
      dueDate: '2024-01-24',
      returnDate: null,
      status: 'Overdue',
      fineAmount: 35,
      renewalCount: 1,
      issueMethod: 'RFID'
    },
    {
      id: 3,
      bookId: 2,
      bookTitle: 'To Kill a Mockingbird',
      memberName: 'Alice Johnson',
      memberId: 'M003',
      issueDate: '2024-01-12',
      dueDate: '2024-01-26',
      returnDate: '2024-01-20',
      status: 'Returned',
      fineAmount: 0,
      renewalCount: 0,
      issueMethod: 'Barcode'
    },
    {
      id: 4,
      bookId: 2,
      bookTitle: 'To Kill a Mockingbird',
      memberName: 'Bob Wilson',
      memberId: 'M004',
      issueDate: '2024-01-18',
      dueDate: '2024-02-01',
      returnDate: null,
      status: 'Issued',
      fineAmount: 0,
      renewalCount: 0,
      issueMethod: 'RFID'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    barcode: '',
    rfidTag: '',
    category: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    pages: 1,
    language: 'English',
    location: '',
    condition: 'Good',
    price: 0,
    totalCopies: 1
  });

  // Enhanced filtering and sorting
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm) ||
                         book.barcode.includes(searchTerm) ||
                         book.rfidTag.includes(searchTerm);
    const matchesCategory = filterCategory === 'All' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'author': return a.author.localeCompare(b.author);
      case 'category': return a.category.localeCompare(b.category);
      case 'addedDate': return new Date(b.addedDate) - new Date(a.addedDate);
      default: return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Auto fine calculation
  const calculateFine = (dueDate, returnDate = new Date()) => {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    const diffTime = returned - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 5 : 0; // ₹5 per day fine
  };

  // Generate barcode
  const generateBarcode = () => {
    return 'BC' + Date.now().toString().slice(-12);
  };

  // Generate RFID tag
  const generateRFID = () => {
    return 'RFID' + Date.now().toString().slice(-12);
  };

  const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Mystery', 'Romance', 'Dystopian'];

  const getBookTransactions = (bookId) => {
    return transactions.filter(t => t.bookId === bookId);
  };

  const showBookHistory = (book) => {
    setSelectedBook(book);
    setShowHistory(true);
  };

  const handleAddBook = () => {
    const newBarcode = generateBarcode();
    const newRFID = generateRFID();
    setFormData({ 
      title: '', author: '', isbn: '', barcode: newBarcode, rfidTag: newRFID,
      category: '', publisher: '', publicationYear: new Date().getFullYear(),
      pages: 1, language: 'English', location: '', condition: 'Good', price: 0, totalCopies: 1 
    });
    setShowAddModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      barcode: book.barcode,
      rfidTag: book.rfidTag,
      category: book.category,
      publisher: book.publisher || '',
      publicationYear: book.publicationYear || new Date().getFullYear(),
      pages: book.pages || 1,
      language: book.language || 'English',
      location: book.location || '',
      condition: book.condition || 'Good',
      price: book.price || 0,
      totalCopies: book.totalCopies
    });
    setShowEditModal(true);
  };

  const handleDeleteBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${book.title}" `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setBooks(books.filter(book => book.id !== bookId));
      // toast.success('Book deleted successfully!');
        toast.success('Book deleted successfully!');
      }
    });
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    const newBook = {
      id: Math.max(...books.map(b => b.id)) + 1,
      ...formData,
      status: 'Available',
      availableCopies: formData.totalCopies,
      issuedCopies: 0,
      reservedCopies: 0,
      addedDate: new Date().toISOString().split('T')[0]
    };
    setBooks([...books, newBook]);
    setShowAddModal(false);
    toast.success(`"${formData.title}" added to catalog successfully!`);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    const updatedBooks = books.map(book => 
      book.id === editingBook.id 
        ? { ...book, ...formData, availableCopies: formData.totalCopies - book.issuedCopies }
        : book
    );
    setBooks(updatedBooks);
    setShowEditModal(false);
    toast.success(`"${formData.title}" updated successfully!`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['totalCopies', 'pages', 'publicationYear', 'price'].includes(name) 
        ? (parseFloat(value) || 0) 
        : value
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Catalog Management</h1>
          <p className="text-gray-600">Complete library catalog with barcode/RFID tracking and auto fine calculation</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCatalogModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaEye className="mr-2" />
            View Catalog
          </button>
          <button 
            onClick={handleAddBook}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Add New Book
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, ISBN, barcode, or RFID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="category">Sort by Category</option>
              <option value="addedDate">Sort by Date Added</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaBook className="text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.author}</div>
                        <div className="text-xs text-gray-400">ISBN: {book.isbn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <FaBarcode className="text-gray-400 mr-2" />
                        <span className="text-xs">{book.barcode}</span>
                      </div>
                      <div className="flex items-center">
                        <FaQrcode className="text-gray-400 mr-2" />
                        <span className="text-xs">{book.rfidTag}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{book.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="text-green-600 font-medium">Available: {book.availableCopies}</span>
                      <span className="text-red-600">Issued: {book.issuedCopies}</span>
                      <span className="text-gray-500">Total: {book.totalCopies}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {book.availableCopies > 0 ? 'Available' : 'All Issued'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => showBookHistory(book)}
                      className="text-purple-600 hover:text-purple-900 mr-3 cursor-pointer"
                      title="View History"
                    >
                      <FaHistory />
                    </button>
                    <button 
                      onClick={() => handleEditBook(book)}
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                      title="Edit Book"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteBook(book.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      title="Delete Book"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredBooks.length)} of {filteredBooks.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book History Modal */}
      {showHistory && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedBook.title}</h2>
                  <p className="text-gray-600">Transaction History & Current Status</p>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800">Available Copies</h3>
                  <p className="text-2xl font-bold text-green-600">{selectedBook.availableCopies}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800">Issued Copies</h3>
                  <p className="text-2xl font-bold text-red-600">{selectedBook.issuedCopies}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Total Copies</h3>
                  <p className="text-2xl font-bold text-blue-600">{selectedBook.totalCopies}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
                <div className="space-y-3">
                  {getBookTransactions(selectedBook.id).length > 0 ? (
                    getBookTransactions(selectedBook.id).map((transaction) => (
                      <div key={transaction.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{transaction.memberName}</p>
                            <p className="text-sm text-gray-600">Member ID: {transaction.memberId}</p>
                            <p className="text-sm text-gray-600">Issue Date: {transaction.issueDate}</p>
                            <p className="text-sm text-gray-600">Due Date: {transaction.dueDate}</p>
                            {transaction.returnDate && (
                              <p className="text-sm text-gray-600">Return Date: {transaction.returnDate}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'Returned' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No transactions found for this book.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Add New Book</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitAdd} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                  <input
                    type="number"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Edit Book</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitEdit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                  <input
                    type="number"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;