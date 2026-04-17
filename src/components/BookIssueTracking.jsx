import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaBook, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookIssueAPI, bookAPI, studentAPI, memberAPI } from '../services/api';

const BookIssueTracking = () => {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    bookId: '',
    bookTitle: '',
    issueDate: '',
    dueDate: '',
    status: 'issued'
  });

  const [filterStatus, setFilterStatus] = useState('All');
  const [bookSearch, setBookSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  useEffect(() => {
    fetchIssues();
    fetchBooks();
    fetchStudents();
    fetchMembers();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowBookDropdown(false);
        setShowStudentDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookAPI.getAll();
      if (response.data.success) {
        setBooks(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch books');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch students');
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await memberAPI.getAll();
      if (response.data.success) {
        setMembers(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch members');
    }
  };

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await bookIssueAPI.getAll();
      if (response.data.success) {
        setIssues(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch book issues');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookSelect = (book) => {
    setFormData(prev => ({
      ...prev,
      bookId: book._id || book.id,
      bookTitle: book.title
    }));
    setBookSearch(book.title);
    setShowBookDropdown(false);
  };

  const handleStudentSelect = (student) => {
    setFormData(prev => ({
      ...prev,
      studentId: student._id || student.id,
      studentName: student.name
    }));
    setStudentSearch(student.name);
    setShowStudentDropdown(false);
  };

  const filteredBooks = books.filter(book => 
    book.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.author?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredStudentsMembers = [
    ...students.map(s => ({ ...s, type: 'Student' })),
    ...members.map(m => ({ ...m, type: 'Member' }))
  ].filter(person => 
    person.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    person.id?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    person.rollNo?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.bookId || !formData.issueDate || !formData.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if book is available
    const selectedBook = books.find(b => (b._id || b.id) === formData.bookId);
    if (selectedBook && selectedBook.availableCopies <= 0) {
      toast.error('This book is not available for issue');
      return;
    }

    setLoading(true);
    try {
      const randomBookId = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const payload = {
        ...formData,
        randomBookId
      };
      
      if (editingId) {
        await bookIssueAPI.update(editingId, payload);
        toast.success('Issue record updated');
        setEditingId(null);
      } else {
        await bookIssueAPI.issue(payload);
        toast.success('Book issued successfully');
      }
      
      setFormData({ studentId: '', studentName: '', bookId: '', bookTitle: '', issueDate: '', dueDate: '', status: 'issued' });
      setBookSearch('');
      setStudentSearch('');
      setShowForm(false);
      fetchIssues();
      fetchBooks(); // Refresh books to update available copies
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (issue) => {
    setFormData({
      studentId: issue.studentId,
      studentName: issue.studentName,
      bookId: issue.bookId,
      bookTitle: issue.bookTitle,
      issueDate: issue.issueDate,
      dueDate: issue.dueDate || '',
      status: issue.status
    });
    setBookSearch(issue.bookTitle || '');
    setStudentSearch(issue.studentName || '');
    setEditingId(issue._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await bookIssueAPI.delete(id);
      toast.success('Record deleted');
      fetchIssues();
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ studentId: '', studentName: '', bookId: '', bookTitle: '', issueDate: '', dueDate: '', status: 'issued' });
    setBookSearch('');
    setStudentSearch('');
  };

  const handleReturn = async (id) => {
    setLoading(true);
    try {
      await bookIssueAPI.return(id, {
        returnDate: new Date().toISOString().split('T')[0]
      });
      toast.success('Book returned successfully');
      fetchIssues();
    } catch (error) {
      toast.error('Failed to return book');
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = filterStatus === 'All' 
    ? issues 
    : issues.filter(issue => issue.status === filterStatus);

  const stats = {
    total: issues.length,
    issued: issues.filter(i => i.status === 'issued').length,
    returned: issues.filter(i => i.status === 'returned').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Book Issue Tracking</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Issue Book
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Issues</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Currently Issued</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.issued}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Returned</p>
          <p className="text-2xl font-bold text-green-600">{stats.returned}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Issue Record' : 'Issue New Book'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Student/Member Searchable Dropdown */}
              <div className="relative dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Student/Member *
                  {formData.studentId && (
                    <span className="ml-2 text-xs text-green-600">✓ Selected</span>
                  )}
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      setShowStudentDropdown(true);
                    }}
                    onFocus={() => setShowStudentDropdown(true)}
                    placeholder="Search by name or ID..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {showStudentDropdown && filteredStudentsMembers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredStudentsMembers.slice(0, 10).map((person) => (
                      <div
                        key={person._id || person.id}
                        onClick={() => handleStudentSelect(person)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">{person.name}</p>
                            <p className="text-xs text-gray-500">
                              {person.type} • ID: {person.id || person._id} {person.rollNo && `• Roll: ${person.rollNo}`}
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {person.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Book Searchable Dropdown */}
              <div className="relative dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Book *
                  {formData.bookId && (
                    <span className="ml-2 text-xs text-green-600">✓ Selected</span>
                  )}
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={bookSearch}
                    onChange={(e) => {
                      setBookSearch(e.target.value);
                      setShowBookDropdown(true);
                    }}
                    onFocus={() => setShowBookDropdown(true)}
                    placeholder="Search by title, author, ISBN..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {showBookDropdown && filteredBooks.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredBooks.slice(0, 10).map((book) => (
                      <div
                        key={book._id || book.id}
                        onClick={() => handleBookSelect(book)}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">{book.title}</p>
                            <p className="text-xs text-gray-500">
                              {book.author} • ISBN: {book.isbn}
                            </p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Available: {book.availableCopies || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hidden fields for IDs */}
              <input type="hidden" name="studentId" value={formData.studentId} />
              <input type="hidden" name="bookId" value={formData.bookId} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="issued">Issued</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <FaTimes /> Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <FaCheck /> {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {['All', 'issued', 'returned'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Book ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Book Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Return Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  Loading issues...
                </td>
              </tr>
            ) : filteredIssues.length > 0 ? (
              filteredIssues.map(issue => (
              <tr key={issue._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700">{issue.memberId}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{issue.memberName}</td>
                <td className="px-6 py-3 text-sm text-gray-700 font-mono">{issue.randomBookId || 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase()}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{issue.bookTitle}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{issue.issueDate}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{issue.dueDate}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{issue.returnDate || '-'}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    issue.status === 'issued'
                      ? 'bg-yellow-100 text-yellow-700'
                      : issue.status === 'returned'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {issue.status?.charAt(0).toUpperCase() + issue.status?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm space-x-2">
                  {issue.status === 'issued' && (
                    <button
                      onClick={() => handleReturn(issue._id)}
                      className="text-green-600 hover:text-green-800 transition"
                      title="Mark as returned"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(issue)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(issue._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No book issues found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookIssueTracking;
