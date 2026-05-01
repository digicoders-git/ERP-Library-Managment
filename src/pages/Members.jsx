import { useState, useEffect } from 'react';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaEnvelope, FaPhone, FaChevronLeft, FaChevronRight, FaTimes, FaCheck, FaIdCard, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip';
import Select from 'react-select';
import { memberAPI, authAPI, studentAPI } from '../services/api';
import MembershipCardPreview from '../components/MembershipCardPreview';
const Members = () => {
  const [members, setMembers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedMemberForCard, setSelectedMemberForCard] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [branchName, setBranchName] = useState("");
  const [schoolLogo, setSchoolLogo] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    memberId: '',
    memberType: 'General',
    address: '',
    studentId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    validTill: '',
    status: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserInfo(user);
    fetchMembers();
    fetchProfile();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await studentAPI.getAll();
      setStudents(data.data || []);
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data } = await authAPI.getProfile();
      const profileData = data.data?.librarian;
      if (profileData) {
        if (profileData.branch) {
          setBranchName(profileData.branch.branchName || "");
        }
        if (profileData.logo) {
          setSchoolLogo(profileData.logo);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await memberAPI.getAll();
      if (response.data.success) {
        setMembers(response.data.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      memberId: '',
      memberType: 'General',
      address: '',
      studentId: '',
      joiningDate: new Date().toISOString().split('T')[0],
      validTill: '',
      status: true
    });
    setShowModal(true);
  };

  const handleEditMember = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      memberId: member.id,
      memberType: member.memberType,
      address: member.address || '',
      studentId: member.studentId || '',
      joiningDate: member.joinDate || new Date().toISOString().split('T')[0],
      validTill: member.validTill === 'Lifetime' ? '' : member.validTill,
      status: member.status === 'Active'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await memberAPI.update(editingId, formData);
        toast.success('Member updated successfully');
      } else {
        await memberAPI.add(formData);
        toast.success('Member added successfully');
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', memberId: '', memberType: 'General', address: '', studentId: '' });
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = (memberId) => {
    const member = members.find(m => m._id === memberId);
    
    // Prevent deleting auto-synced students
    if (member && member.memberType === 'Student') {
      toast.error('Student members are synchronized automatically and cannot be deleted manually from the library.');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Delete member "${member.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await memberAPI.delete(memberId);
          toast.success('Member deleted successfully!');
          fetchMembers();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete member');
        }
      }
    });
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Members Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage library members and their information</p>
          {userInfo && (
            <p className="text-xs text-gray-500 mt-1">
              Branch: {userInfo.branchName || userInfo.branch || 'N/A'} | School: {userInfo.schoolName || userInfo.school || 'N/A'}
            </p>
          )}
        </div>
        <button 
          onClick={handleAddMember}
          className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center cursor-pointer text-sm sm:text-base"
          data-tooltip-id="add-member-tooltip"
          data-tooltip-content="Add new library member"
        >
          <FaPlus className="mr-2" />
          Add New Member
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="relative">
            <FaSearch 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              data-tooltip-id="search-members-tooltip"
              data-tooltip-content="Search by name, email or member ID"
            />
            <input
              type="text"
              placeholder="Search members by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Details</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Join Date</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMembers.length > 0 ? currentMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-green-600 text-sm sm:text-base" />
                        </div>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-32 sm:max-w-none">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        {member.email}
                      </div>
                      <div className="flex items-center">
                        <FaPhone className="text-gray-400 mr-2" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedMemberForCard(member)}
                      className="text-purple-600 hover:text-purple-900 mr-3 cursor-pointer"
                      data-tooltip-id="card-member-tooltip"
                      data-tooltip-content="View Library Card"
                    >
                      <FaIdCard />
                    </button>
                    <button 
                      onClick={() => handleEditMember(member)}
                      className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                      data-tooltip-id="edit-member-tooltip"
                      data-tooltip-content="Edit member details"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteMember(member._id)}
                      className={`${member.memberType === 'Student' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900 cursor-pointer'}`}
                      data-tooltip-id="delete-member-tooltip"
                      data-tooltip-content={member.memberType === 'Student' ? 'Cannot delete synced students' : 'Delete member account'}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Loading members...' : 'No members found. Add members to get started.'}
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} results
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

      {/* Add/Edit Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Member' : 'Add New Member'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Type</label>
                  <select
                    name="memberType"
                    value={formData.memberType}
                    onChange={(e) => {
                      const type = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        memberType: type,
                        studentId: ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Staff">Staff</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Student">Student</option>
                  </select>
                </div>

                {formData.memberType === 'Student' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
                    <Select
                      options={students.map(s => ({
                        value: s._id,
                        label: `${s.firstName} ${s.lastName} (${s.admissionNumber || s.rollNumber})`,
                        student: s
                      }))}
                      onChange={(selected) => {
                        if (selected) {
                          const s = selected.student;
                          setFormData(prev => ({
                            ...prev,
                            studentId: s._id,
                            name: `${s.firstName} ${s.lastName}`,
                            email: s.email,
                            phone: s.phone || '',
                            memberId: s.admissionNumber || s.rollNumber || ''
                          }));
                        }
                      }}
                      placeholder="Search students..."
                      className="text-sm"
                      isSearchable
                      isLoading={loading}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member ID / Roll No</label>
                  <input
                    type="text"
                    name="memberId"
                    value={formData.memberId}
                    onChange={handleInputChange}
                    placeholder="e.g., LIB-001 or Roll No"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  ></textarea>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
                  <input
                    type="date"
                    name="validTill"
                    value={formData.validTill}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank for Lifetime membership</p>
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Membership Status:</label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.status ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`${formData.status ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                  <span className={`text-sm font-bold ${formData.status ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setFormData({ name: '', email: '', phone: '', memberId: '', memberType: 'General', address: '', studentId: '' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  {loading && editingId === null ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  {editingId ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tooltips */}
      <Tooltip id="add-member-tooltip" place="top" style={{ backgroundColor: '#059669', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="search-members-tooltip" place="top" style={{ backgroundColor: '#374151', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="card-member-tooltip" place="top" style={{ backgroundColor: '#9333EA', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="edit-member-tooltip" place="top" style={{ backgroundColor: '#2563EB', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />
      <Tooltip id="delete-member-tooltip" place="top" style={{ backgroundColor: '#DC2626', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }} />

      {/* Membership Card Modal */}
      {selectedMemberForCard && (
        <MembershipCardPreview 
          member={selectedMemberForCard} 
          libraryName={branchName || userInfo?.schoolName || userInfo?.branchName || "Library Management"}
          logo={schoolLogo}
          onClose={() => setSelectedMemberForCard(null)} 
        />
      )}
    </div>
  );
};

export default Members;