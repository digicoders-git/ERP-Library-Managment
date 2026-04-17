import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaBook, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookLimitAPI, bookIssueAPI, studentAPI } from '../services/api';

const BookLimitManagement = () => {
  const [limits, setLimits] = useState([]);
  const [studentUsage, setStudentUsage] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    class: '',
    maxBooks: '',
    maxDays: '',
    renewalAllowed: true,
    renewalTimes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [limitsRes, issuesRes, studentsRes, classesRes] = await Promise.all([
        bookLimitAPI.getAll(),
        bookIssueAPI.getAll({ status: 'issued' }),
        studentAPI.getAll(),
        studentAPI.getClasses()
      ]);

      setLimits(limitsRes.data.data || []);
      setClasses(classesRes.data.data || []);

      const issues = issuesRes.data.data || [];
      const students = studentsRes.data.data || [];

      const studentUsageMap = {};
      issues.forEach(issue => {
        if (issue.memberType === 'Student' && issue.member) {
          const studentId = issue.member._id || issue.member;
          if (!studentUsageMap[studentId]) {
            studentUsageMap[studentId] = {
              booksIssued: 0,
              issues: []
            };
          }
          studentUsageMap[studentId].booksIssued += 1;
          studentUsageMap[studentId].issues.push(issue);
        }
      });

      const usage = students.map(student => {
        const usage = studentUsageMap[student._id] || { booksIssued: 0, issues: [] };
        const classObj = classesRes.data.data?.find(c => c._id === student.class);
        const className = classObj?.className || 'Unknown';
        const studentLimit = limitsRes.data.data?.find(l => l.class === className);
        const maxBooks = studentLimit?.maxBooks || 5;
        const daysLeft = usage.issues.length > 0 
          ? Math.max(...usage.issues.map(i => Math.ceil((new Date(i.dueDate) - new Date()) / (1000 * 60 * 60 * 24))))
          : 0;

        return {
          _id: student._id,
          studentId: student.rollNumber || student._id,
          studentName: student.firstName + ' ' + student.lastName,
          class: className,
          booksIssued: usage.booksIssued,
          maxBooks,
          daysLeft: Math.max(daysLeft, 0)
        };
      }).filter(s => s.booksIssued > 0);

      setStudentUsage(usage);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load book limits');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.class || !formData.maxBooks || !formData.maxDays || !formData.renewalTimes) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        class: formData.class,
        maxBooks: parseInt(formData.maxBooks),
        maxDays: parseInt(formData.maxDays),
        renewalAllowed: formData.renewalAllowed,
        renewalTimes: parseInt(formData.renewalTimes)
      };

      if (editingId) {
        await bookLimitAPI.update(editingId, data);
        toast.success('Book limit updated successfully');
      } else {
        await bookLimitAPI.create(data);
        toast.success('Book limit added successfully');
      }
      
      setFormData({ class: '', maxBooks: '', maxDays: '', renewalAllowed: true, renewalTimes: '' });
      setShowForm(false);
      setEditingId(null);
      await fetchData();
    } catch (error) {
      console.error('Error saving limit:', error);
      toast.error(error.response?.data?.message || 'Failed to save book limit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (limit) => {
    setFormData(limit);
    setEditingId(limit._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this limit?')) return;
    
    try {
      setSubmitting(true);
      await bookLimitAPI.delete(id);
      toast.success('Book limit deleted successfully');
      await fetchData();
    } catch (error) {
      console.error('Error deleting limit:', error);
      toast.error(error.response?.data?.message || 'Failed to delete book limit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ class: '', maxBooks: '', maxDays: '', renewalAllowed: true, renewalTimes: '' });
  };

  const getUsagePercentage = (issued, max) => {
    return Math.round((issued / max) * 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading book limits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Limit Configuration</h2>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Class-wise Limits</h3>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              disabled={submitting}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <FaPlus /> Add Limit
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Book Limit' : 'Add New Book Limit'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => {
                      const displayName = cls.stream && cls.stream.length > 0 
                        ? `${cls.className} - ${cls.stream.join(', ')}`
                        : cls.className;
                      return (
                        <option key={cls._id} value={displayName}>
                          {displayName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Books *</label>
                  <input
                    type="number"
                    name="maxBooks"
                    value={formData.maxBooks}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Days *</label>
                  <input
                    type="number"
                    name="maxDays"
                    value={formData.maxDays}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Renewal Times *</label>
                  <input
                    type="number"
                    name="renewalTimes"
                    value={formData.renewalTimes}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="renewalAllowed"
                  checked={formData.renewalAllowed}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Allow Renewal</label>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {limits.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaBook className="text-4xl mx-auto mb-3 opacity-50" />
              <p>No book limits configured yet. Add one to get started.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Max Books</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Max Days</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Renewal Allowed</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Renewal Times</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {limits.map(limit => (
                  <tr key={limit._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{limit.class}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{limit.maxBooks}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{limit.maxDays} days</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        limit.renewalAllowed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {limit.renewalAllowed ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{limit.renewalTimes}</td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(limit)}
                        disabled={submitting}
                        className="text-blue-600 hover:text-blue-800 transition disabled:opacity-50"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(limit._id)}
                        disabled={submitting}
                        className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Book Usage</h2>
        
        <div className="space-y-3">
          {studentUsage.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
              <p>No active book issues. Students will appear here when they issue books.</p>
            </div>
          ) : (
            studentUsage.map(student => {
              const percentage = getUsagePercentage(student.booksIssued, student.maxBooks);
              return (
                <div key={student._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{student.studentName}</h3>
                      <p className="text-sm text-gray-600">{student.studentId} • {student.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{student.booksIssued}/{student.maxBooks} Books</p>
                      <p className="text-sm text-gray-600">{student.daysLeft} days left</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getUsageColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{percentage}% of limit used</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BookLimitManagement;
