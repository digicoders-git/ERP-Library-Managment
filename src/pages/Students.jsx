import { useState, useEffect } from 'react';
import { FaUserGraduate, FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaEnvelope, FaGraduationCap, FaChevronLeft, FaChevronRight, FaTimes, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip';
import { studentAPI } from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    class: '',
    section: '',
    year: '',
    address: '',
    parentName: '',
    parentPhone: '',
    status: 'Active'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserInfo(user);
    fetchClasses();
    fetchStudents();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await studentAPI.getClasses();
      if (response.data.success) {
        setClasses(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const fetchSections = async (classId) => {
    if (!classId) {
      setSections([]);
      return;
    }
    setLoadingSections(true);
    try {
      const response = await studentAPI.getSections(classId);
      if (response.data.success) {
        setSections(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setLoadingSections(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll();
      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
    const className = typeof student.class === 'object' ? student.class.className : student.class || '';
    const sectionName = typeof student.section === 'object' ? student.section.sectionName : student.section || '';
    
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.rollNumber && student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.admissionNumber && student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sectionName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'class') {
      fetchSections(value);
      setFormData(prev => ({ ...prev, section: '' }));
    }
  };

  const handleAddStudent = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      rollNo: '',
      class: '',
      section: '',
      year: '',
      address: '',
      parentName: '',
      parentPhone: '',
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingId(student._id);
    const classId = typeof student.class === 'object' ? student.class._id : student.class || '';
    fetchSections(classId);
    setFormData({
      name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
      email: student.email || '',
      phone: student.phone || '',
      rollNo: student.rollNumber || '',
      class: classId,
      section: typeof student.section === 'object' ? student.section._id : student.section || '',
      year: student.year || '',
      address: student.address || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      status: student.status === 'active' ? 'Active' : 'Inactive'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.rollNo || !formData.class) {
      toast.error('Please fill all required fields');
      return;
    }

    // Add branch and school info from logged-in user
    const [firstName, ...lastNameParts] = formData.name.split(' ');
    const dataToSubmit = {
      ...formData,
      firstName: firstName,
      lastName: lastNameParts.join(' ') || 'Student',
      branch: userInfo?.branch || userInfo?.branchId,
      school: userInfo?.school || userInfo?.schoolId,
      branchName: userInfo?.branchName,
      schoolName: userInfo?.schoolName
    };

    setLoading(true);
    try {
      if (editingId) {
        await studentAPI.update(editingId, dataToSubmit);
        toast.success('Student updated successfully');
      } else {
        await studentAPI.create(dataToSubmit);
        toast.success('Student added successfully to your branch');
      }
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = (studentId) => {
    const student = students.find(s => s._id === studentId);
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete student "${student.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        toast.success('Student deleted successfully!');
        fetchStudents();
      }
    });
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Students Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage student records and academic library access</p>
          {userInfo && (
            <p className="text-xs text-gray-500 mt-1">
              Branch: {userInfo.branchName || userInfo.branch || 'N/A'} | School: {userInfo.schoolName || userInfo.school || 'N/A'}
            </p>
          )}
        </div>
        <button 
          onClick={handleAddStudent}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center cursor-pointer text-sm sm:text-base"
          data-tooltip-id="add-student-tooltip"
          data-tooltip-content="Add new student to system"
        >
          <FaPlus className="mr-2" />
          Add New Student
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <FaSearch 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              data-tooltip-id="search-students-tooltip"
              data-tooltip-content="Search by name, email, roll number or class"
            />
            <input
              type="text"
              placeholder="Search students by name, email, roll number, or class..."
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
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Roll Number</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Class & Year</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.length > 0 ? currentStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          {student.profileImage ? (
                            <img src={student.profileImage} alt="" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <FaUserGraduate className="text-purple-600" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                        <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <FaGraduationCap className="text-gray-400 mr-2" />
                        {typeof student.class === 'object' ? student.class.className : (student.class || 'N/A')}
                        {typeof student.section === 'object' ? ` - ${student.section.sectionName}` : (student.section ? ` - ${student.section}` : '')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{student.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (student.status === 'Active' || student.status === 'active') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditStudent(student)}
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                      data-tooltip-id="edit-student-tooltip"
                      data-tooltip-content="Edit student details"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteStudent(student._id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      data-tooltip-id="delete-student-tooltip"
                      data-tooltip-content="Delete student record"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading students...' : 'No students found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} results
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

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Student' : 'Add New Student'}
                  </h2>
                  {userInfo && (
                    <p className="text-xs text-gray-500 mt-1">
                      Adding to: {userInfo.branchName || userInfo.branch} - {userInfo.schoolName || userInfo.school}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter student name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="student@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter roll number"
                    required
                  />
                </div>

                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>{cls.className}</option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!formData.class || loadingSections}
                    required
                  >
                    <option value="">{loadingSections ? 'Loading...' : 'Select Section'}</option>
                    {sections.map(sec => (
                      <option key={sec._id} value={sec._id}>{sec.sectionName}</option>
                    ))}
                  </select>
                </div>


                {/* Parent Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter parent name"
                  />
                </div>

                {/* Parent Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Phone</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter parent phone"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter full address"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      {editingId ? 'Update Student' : 'Add Student'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tooltips */}
      <Tooltip id="add-student-tooltip" place="top" style={{ backgroundColor: '#7C3AED', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="search-students-tooltip" place="top" style={{ backgroundColor: '#374151', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="edit-student-tooltip" place="top" style={{ backgroundColor: '#2563EB', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="delete-student-tooltip" place="top" style={{ backgroundColor: '#DC2626', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
    </div>
  );
};

export default Students;