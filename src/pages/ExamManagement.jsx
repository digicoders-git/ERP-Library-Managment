import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCalendar, FaBook, FaUsers, FaChevronLeft, FaChevronRight, FaTimes, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip';

const ExamManagement = () => {
  const [exams, setExams] = useState([
    { id: 1, name: 'Midterm Examination', subject: 'Computer Science', date: '2024-02-15', time: '10:00 AM', duration: '2 hours', totalStudents: 45, status: 'Scheduled' },
    { id: 2, name: 'Final Examination', subject: 'Mathematics', date: '2024-03-20', time: '02:00 PM', duration: '3 hours', totalStudents: 52, status: 'Scheduled' },
    { id: 3, name: 'Practical Exam', subject: 'Physics Lab', date: '2024-02-10', time: '09:00 AM', duration: '4 hours', totalStudents: 30, status: 'Completed' },
    { id: 4, name: 'Quiz Assessment', subject: 'English Literature', date: '2024-02-08', time: '11:00 AM', duration: '1 hour', totalStudents: 48, status: 'Completed' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    totalStudents: '',
    status: 'Scheduled'
  });

  const filteredExams = exams.filter(exam =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalStudents' ? parseInt(value) || 0 : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Exam name is required');
      return false;
    }
    if (!formData.subject.trim()) {
      toast.error('Subject is required');
      return false;
    }
    if (!formData.date) {
      toast.error('Date is required');
      return false;
    }
    if (!formData.time) {
      toast.error('Time is required');
      return false;
    }
    if (!formData.duration.trim()) {
      toast.error('Duration is required');
      return false;
    }
    if (formData.totalStudents <= 0) {
      toast.error('Total students must be greater than 0');
      return false;
    }
    return true;
  };

  const handleAddExam = () => {
    setFormData({
      name: '',
      subject: '',
      date: '',
      time: '',
      duration: '',
      totalStudents: '',
      status: 'Scheduled'
    });
    setShowAddModal(true);
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setFormData(exam);
    setShowEditModal(true);
  };

  const handleDeleteExam = (examId) => {
    const exam = exams.find(e => e.id === examId);
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${exam.name}" exam?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setExams(exams.filter(e => e.id !== examId));
        toast.success('Exam deleted successfully!');
      }
    });
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newExam = {
      id: Math.max(...exams.map(e => e.id), 0) + 1,
      ...formData
    };
    setExams([...exams, newExam]);
    setShowAddModal(false);
    toast.success('Exam added successfully!');
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setExams(exams.map(e => e.id === editingExam.id ? { ...e, ...formData } : e));
    setShowEditModal(false);
    toast.success('Exam updated successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ExamModal = ({ isOpen, isEdit, onClose, onSubmit }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Exam' : 'Add New Exam'}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <FaTimes />
              </button>
            </div>
          </div>
          
          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Midterm Examination"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
                <input
                  type="number"
                  name="totalStudents"
                  value={formData.totalStudents}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEdit ? 'Update' : 'Add'} Exam
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Exam Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Schedule and manage academic examinations</p>
        </div>
        <button 
          onClick={handleAddExam}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center cursor-pointer text-sm sm:text-base"
          data-tooltip-id="add-exam-tooltip"
          data-tooltip-content="Add new exam"
        >
          <FaPlus className="mr-2" />
          Add New Exam
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search exams by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaCalendar className="text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{exam.name}</div>
                        <div className="text-sm text-gray-500">{exam.subject}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{exam.date}</div>
                    <div className="text-xs text-gray-500">{exam.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUsers className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{exam.totalStudents}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditExam(exam)}
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                      data-tooltip-id="edit-exam-tooltip"
                      data-tooltip-content="Edit exam"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteExam(exam.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      data-tooltip-id="delete-exam-tooltip"
                      data-tooltip-content="Delete exam"
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredExams.length)} of {filteredExams.length} results
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

      <ExamModal 
        isOpen={showAddModal} 
        isEdit={false}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitAdd}
      />
      <ExamModal 
        isOpen={showEditModal} 
        isEdit={true}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitEdit}
      />

      <Tooltip id="add-exam-tooltip" place="top" style={{ backgroundColor: '#2563EB', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="edit-exam-tooltip" place="top" style={{ backgroundColor: '#2563EB', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="delete-exam-tooltip" place="top" style={{ backgroundColor: '#DC2626', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
    </div>
  );
};

export default ExamManagement;