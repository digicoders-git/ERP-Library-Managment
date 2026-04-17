import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { digitalLibraryAPI, authAPI } from '../services/api';
import api from '../services/api';

const DigitalLibrary = () => {
  const [digitalBooks, setDigitalBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [branches, setBranches] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    branch: '',
    class: '',
    stream: '',
    file: null,
    fileSize: '',
    uploadDate: new Date().toISOString().split('T')[0]
  });

  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi', 'Computer Science'];

  useEffect(() => {
    fetchBranches();
    fetchClasses();
    fetchDigitalBooks();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data } = await authAPI.getProfile();
      const profileData = data.data?.librarian || data.data?.admin || data.data;
      if (profileData?.branch) {
        setBranches([profileData.branch]);
        setFormData(prev => ({
          ...prev,
          branch: profileData.branch._id || profileData.branch
        }));
      }
    } catch (error) {
      console.error('Failed to fetch branches');
    }
  };

  const fetchClasses = async () => {
    try {
      const { data } = await authAPI.getProfile();
      const profileData = data.data?.librarian || data.data?.admin || data.data;
      const branchId = profileData?.branch?._id || profileData?.branch;
      
      if (branchId) {
        const response = await api.get(`/api/class/all?branch=${branchId}`);
        if (response.data.classes) {
          setClasses(response.data.classes);
        }
      }
    } catch (error) {
      console.error('Failed to fetch classes');
    }
  };

  const fetchDigitalBooks = async () => {
    setLoading(true);
    try {
      const response = await digitalLibraryAPI.getAll();
      if (response.data.success) {
        setDigitalBooks(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch digital books');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData(prev => ({
        ...prev,
        file: files ? files[0] : null,
        fileSize: files ? (files[0].size / 1024 / 1024).toFixed(2) + ' MB' : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getStreamsForClass = (classId) => {
    const selectedClass = classes.find(c => c._id === classId);
    return selectedClass?.stream || [];
  };

  const filteredClasses = formData.branch 
    ? classes.filter(c => {
        const cBranchId = c.branch?._id || c.branch;
        const fBranchId = formData.branch;
        return cBranchId === fBranchId;
      })
    : classes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.branch || !formData.class) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!editingId && !formData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('subject', formData.subject);
      payload.append('class', formData.class);
      payload.append('uploadDate', formData.uploadDate);
      
      if (formData.stream && formData.stream.trim()) {
        payload.append('stream', formData.stream);
      }
      
      if (formData.file) {
        payload.append('file', formData.file);
      }
      
      if (editingId) {
        await digitalLibraryAPI.update(editingId, payload);
        toast.success('Digital book updated');
      } else {
        await digitalLibraryAPI.create(payload);
        toast.success('Digital book uploaded');
      }
      setFormData({ title: '', subject: '', branch: formData.branch, class: '', stream: '', file: null, fileSize: '', uploadDate: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      setEditingId(null);
      fetchDigitalBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      subject: book.subject,
      branch: book.branch?._id || book.branch || '',
      class: book.class?._id || book.class || '',
      stream: book.stream || '',
      fileSize: book.fileSize || '',
      uploadDate: book.uploadDate ? book.uploadDate.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setEditingId(book._id || book.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await digitalLibraryAPI.delete(id);
      toast.success('Digital book deleted');
      fetchDigitalBooks();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', subject: '', branch: formData.branch, class: '', stream: '', file: null, fileSize: '', uploadDate: new Date().toISOString().split('T')[0] });
  };

  const handleDownload = async (id, book) => {
    try {
      if (!book?.fileUrl) {
        toast.error('File URL not found');
        return;
      }
      
      // Direct file download - open in new window to trigger download
      const fileUrl = book.fileUrl.startsWith('http') 
        ? book.fileUrl 
        : `http://localhost:5002${book.fileUrl}`;
      
      // Use window.open to trigger browser download
      window.open(fileUrl, '_blank');
      
      // Increment download count in background
      setTimeout(() => {
        api.put(`/api/library-panel/digital-library/download/${id}`).catch(err => console.error('Failed to increment download count'));
        fetchDigitalBooks();
      }, 1000);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  const stats = {
    total: digitalBooks.length,
    totalSize: digitalBooks.reduce((sum, b) => sum + parseFloat(b.fileSize || 0), 0).toFixed(1),
    totalDownloads: digitalBooks.reduce((sum, b) => sum + (b.downloads || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Digital Library</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Upload Book
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Books</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Total Size</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalSize} MB</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Downloads</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalDownloads}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Digital Book' : 'Upload New Digital Book'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Book title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch._id} value={branch._id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.branch}
                  required
                >
                  <option value="">Select Class</option>
                  {filteredClasses.map(cls => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>
              {getStreamsForClass(formData.class).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                  <select
                    name="stream"
                    value={formData.stream}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Stream</option>
                    {getStreamsForClass(formData.class).map(stream => (
                      <option key={stream} value={stream}>
                        {stream}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File *</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                  required={!editingId}
                />
                {formData.file && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.file.name} ({formData.fileSize})</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Date</label>
                <input
                  type="date"
                  name="uploadDate"
                  value={formData.uploadDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes /> Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingId ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <FaCheck /> {editingId ? 'Update' : 'Upload'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {digitalBooks.length > 0 ? digitalBooks.map(book => (
          <div key={book._id || book.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-3">
              <FaFilePdf className="text-red-600 text-2xl" />
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(book._id || book.id, book)}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Download"
                >
                  <FaDownload />
                </button>
                <button
                  onClick={() => handleEdit(book)}
                  className="text-green-600 hover:text-green-800 transition"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(book._id || book.id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{book.title}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Subject:</span> {book.subject}</p>
              <p><span className="font-medium">Class:</span> {book.class?.className || book.class}</p>
              {book.stream && <p><span className="font-medium">Stream:</span> {book.stream}</p>}
              <p><span className="font-medium">Size:</span> {book.fileSize}</p>
              <p><span className="font-medium">Uploaded:</span> {book.uploadDate ? new Date(book.uploadDate).toLocaleDateString() : 'N/A'}</p>
              <p className="flex items-center gap-1 text-blue-600">
                <FaDownload className="text-xs" /> {book.downloads} downloads
              </p>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            {loading ? 'Loading digital books...' : 'No digital books found. Upload books to get started.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalLibrary;
