import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaIdCard, FaPrint } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LibraryCardManagement = () => {
  const [cards, setCards] = useState([
    { id: 1, cardId: 'LC001', studentId: 'STU001', studentName: 'Raj Kumar', class: 'Class 10', issueDate: '2024-01-01', expiryDate: '2025-01-01', status: 'Active' },
    { id: 2, cardId: 'LC002', studentId: 'STU002', studentName: 'Priya Singh', class: 'Class 9', issueDate: '2024-01-05', expiryDate: '2025-01-05', status: 'Active' },
    { id: 3, cardId: 'LC003', studentId: 'STU003', studentName: 'Amit Patel', class: 'Class 11', issueDate: '2023-06-01', expiryDate: '2024-06-01', status: 'Expired' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    cardId: '',
    studentId: '',
    studentName: '',
    class: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'Active'
  });

  const [filterStatus, setFilterStatus] = useState('All');

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cardId || !formData.studentId || !formData.studentName || !formData.class || !formData.expiryDate) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingId) {
      setCards(prev => prev.map(card => 
        card.id === editingId ? { ...card, ...formData } : card
      ));
      toast.success('Library card updated');
      setEditingId(null);
    } else {
      const newCard = {
        id: Date.now(),
        ...formData
      };
      setCards(prev => [...prev, newCard]);
      toast.success('Library card created');
    }
    
    setFormData({ cardId: '', studentId: '', studentName: '', class: '', issueDate: new Date().toISOString().split('T')[0], expiryDate: '', status: 'Active' });
    setShowForm(false);
  };

  const handleEdit = (card) => {
    setFormData(card);
    setEditingId(card.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
    toast.success('Library card deleted');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ cardId: '', studentId: '', studentName: '', class: '', issueDate: new Date().toISOString().split('T')[0], expiryDate: '', status: 'Active' });
  };

  const handlePrintCard = (card) => {
    toast.info(`Printing card: ${card.cardId}`);
  };

  const handleRenewCard = (id) => {
    const newExpiryDate = new Date();
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
    
    setCards(prev => prev.map(card =>
      card.id === id
        ? { ...card, expiryDate: newExpiryDate.toISOString().split('T')[0], status: 'Active' }
        : card
    ));
    toast.success('Library card renewed for 1 year');
  };

  const filteredCards = filterStatus === 'All'
    ? cards
    : cards.filter(card => card.status === filterStatus);

  const stats = {
    total: cards.length,
    active: cards.filter(c => c.status === 'Active').length,
    expired: cards.filter(c => c.status === 'Expired').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Library Card Management</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Issue Card
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Cards</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Active Cards</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Expired Cards</p>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Library Card' : 'Issue New Library Card'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card ID *</label>
                <input
                  type="text"
                  name="cardId"
                  value={formData.cardId}
                  onChange={handleInputChange}
                  placeholder="e.g., LC001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="e.g., STU001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="Student name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
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
        {['All', 'Active', 'Expired'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Card ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.map(card => (
              <tr key={card.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700">{card.cardId}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{card.studentId}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{card.studentName}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{card.class}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{card.issueDate}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{card.expiryDate}</td>
                <td className="px-6 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    card.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {card.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm space-x-2">
                  <button
                    onClick={() => handlePrintCard(card)}
                    className="text-purple-600 hover:text-purple-800 transition"
                    title="Print Card"
                  >
                    <FaPrint />
                  </button>
                  {card.status === 'Expired' && (
                    <button
                      onClick={() => handleRenewCard(card.id)}
                      className="text-green-600 hover:text-green-800 transition"
                      title="Renew Card"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(card)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibraryCardManagement;
