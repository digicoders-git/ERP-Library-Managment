import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookIssueAPI } from '../services/api';

const DueDateAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await bookIssueAPI.getAll({ status: 'Issued' });
      if (response.data.success) {
        const issues = response.data.data || [];
        const alertsData = issues.map(issue => {
          const dueDate = new Date(issue.dueDate);
          const today = new Date();
          const diffTime = dueDate - today;
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let status = 'Normal';
          if (daysLeft < 0) status = 'Critical';
          else if (daysLeft === 0) status = 'Overdue';
          else if (daysLeft <= 5) status = 'Warning';
          
          return {
            ...issue,
            daysLeft,
            status
          };
        });
        setAlerts(alertsData);
      }
    } catch (error) {
      toast.error('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (id) => {
    try {
      const alert = alerts.find(a => a._id === id);
      // API call to send reminder
      toast.info(`Reminder sent to ${alert.studentName || alert.memberName}`);
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };

  const handleMarkReturned = async (id) => {
    setLoading(true);
    try {
      await bookIssueAPI.return(id, {
        returnDate: new Date().toISOString().split('T')[0]
      });
      toast.success('Book marked as returned');
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to mark as returned');
    } finally {
      setLoading(false);
    }
  };

  const handleExtendDueDate = async (id) => {
    setLoading(true);
    try {
      const alert = alerts.find(a => a._id === id);
      const newDueDate = new Date(new Date(alert.dueDate).getTime() + 7 * 24 * 60 * 60 * 1000);
      await bookIssueAPI.update(id, {
        dueDate: newDueDate.toISOString().split('T')[0]
      });
      toast.success('Due date extended by 7 days');
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to extend due date');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Overdue':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Normal':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Critical':
        return <FaExclamationTriangle className="text-red-600" />;
      case 'Overdue':
        return <FaExclamationTriangle className="text-orange-600" />;
      case 'Warning':
        return <FaClock className="text-yellow-600" />;
      case 'Normal':
        return <FaCheck className="text-green-600" />;
      default:
        return <FaBell className="text-gray-600" />;
    }
  };

  const filteredAlerts = filter === 'All'
    ? alerts
    : alerts.filter(alert => alert.status === filter);

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.status === 'Critical').length,
    overdue: alerts.filter(a => a.status === 'Overdue').length,
    warning: alerts.filter(a => a.status === 'Warning').length,
    normal: alerts.filter(a => a.status === 'Normal').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Due Date Alerts</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Alerts</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Critical</p>
            <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm">Overdue</p>
            <p className="text-2xl font-bold text-orange-600">{stats.overdue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Warning</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Normal</p>
            <p className="text-2xl font-bold text-green-600">{stats.normal}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', 'Critical', 'Overdue', 'Warning', 'Normal'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Loading alerts...</p>
          </div>
        ) : filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div
              key={alert._id}
              className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${getStatusColor(alert.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-2xl mt-1">
                    {getStatusIcon(alert.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{alert.studentName || alert.memberName}</h3>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {alert.studentId || alert.memberId}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.bookTitle}</p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Due Date: </span>
                        <span className="font-semibold text-gray-900">{new Date(alert.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Days Left: </span>
                        <span className={`font-semibold ${
                          alert.daysLeft < 0 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {alert.daysLeft < 0 ? `${Math.abs(alert.daysLeft)} days overdue` : `${alert.daysLeft} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <button
                    onClick={() => handleSendReminder(alert._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                  >
                    <FaBell /> Remind
                  </button>
                  <button
                    onClick={() => handleExtendDueDate(alert._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition text-sm"
                  >
                    <FaClock /> Extend
                  </button>
                  <button
                    onClick={() => handleMarkReturned(alert._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm"
                  >
                    <FaCheck /> Returned
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaCheck className="text-4xl text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No due date alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DueDateAlerts;
