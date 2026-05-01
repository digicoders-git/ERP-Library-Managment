import React, { useState, useEffect } from 'react';
import {
  FaCalendarAlt, FaSearch, FaCheckCircle,
  FaTimesCircle, FaClock, FaChartBar, FaFingerprint,
  FaRegCalendarCheck
} from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMode, setActiveMode] = useState('manual');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAttendance();
    fetchActiveMode();
  }, []);

  const fetchActiveMode = async () => {
    try {
      const { data } = await api.get('/api/staff-panel/attendance-config/settings');
      if (data.success) setActiveMode(data.data.staffMode || 'manual');
    } catch (e) { /* silent */ }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/staff-panel/attendance-staff/my-history');
      if (data.success) setAttendance(data.data);
      else setAttendance([]);
    } catch (error) {
      console.error('Attendance error:', error.response?.data || error.message);
      toast.error('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const total = attendance.length;
  const present = attendance.filter(a => a.status?.toLowerCase() === 'present').length;
  const absent = attendance.filter(a => a.status?.toLowerCase() === 'absent').length;
  const late = attendance.filter(a => a.status?.toLowerCase() === 'late').length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  // Filter
  const filtered = attendance.filter(a => {
    const matchDate = new Date(a.date).toLocaleDateString('en-IN').includes(searchTerm) ||
      new Date(a.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status?.toLowerCase() === filterStatus;
    return matchDate && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return { bg: 'bg-green-100 text-green-700 border-green-200', icon: <FaCheckCircle className="text-green-600" size={12} /> };
      case 'absent':
        return { bg: 'bg-red-100 text-red-700 border-red-200', icon: <FaTimesCircle className="text-red-600" size={12} /> };
      case 'late':
        return { bg: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <FaClock className="text-yellow-600" size={12} /> };
      default:
        return { bg: 'bg-gray-100 text-gray-700 border-gray-200', icon: null };
    }
  };

  const modeConfig = {
    manual: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', label: 'Manual Mode' },
    biometric: { color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500', label: 'Biometric Mode' },
    hybrid: { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', label: 'Hybrid Mode' },
  };
  const mode = modeConfig[activeMode] || modeConfig.manual;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
        <FaCalendarAlt className="absolute inset-0 m-auto text-blue-500" size={20} />
      </div>
      <p className="text-sm font-semibold text-gray-500 animate-pulse">
        Loading attendance logs...
      </p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <FaRegCalendarCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
            <p className="text-gray-500 text-sm">Your personal presence & work log history</p>
          </div>
        </div>

        {/* Mode badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${mode.bg}`}>
          <div className={`w-2 h-2 rounded-full ${mode.dot} animate-pulse`} />
          <FaFingerprint className={mode.color} size={16} />
          <span className={`text-sm font-semibold ${mode.color}`}>{mode.label}</span>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Days', value: total, icon: <FaCalendarAlt size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Present', value: present, icon: <FaCheckCircle size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Absent', value: absent, icon: <FaTimesCircle size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
          { 
            label: 'Attendance Rate', 
            value: `${attendanceRate}%`, 
            icon: <FaChartBar size={20} />, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50',
            extra: (
              <div className="mt-3 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            )
          },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{card.label}</div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{card.value}</div>
            {card.extra}
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-11 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-500 mr-2">Filter:</span>
          {[
            { key: 'all', label: 'All', activeClass: 'bg-gray-800 text-white' },
            { key: 'present', label: 'Present', activeClass: 'bg-green-600 text-white' },
            { key: 'absent', label: 'Absent', activeClass: 'bg-red-600 text-white' },
            { key: 'late', label: 'Late', activeClass: 'bg-yellow-500 text-white' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${filterStatus === f.key
                  ? f.activeClass
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Day</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Punch In</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Punch Out</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                        <FaCalendarAlt className="text-3xl text-gray-300" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">No records found</p>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        {searchTerm || filterStatus !== 'all'
                          ? 'Try adjusting your search filters to find what you are looking for.'
                          : 'Your attendance history will appear here once marked by the administrator.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const badge = getStatusBadge(item.status);
                  const dateObj = new Date(item.date);
                  const isToday = new Date().toDateString() === dateObj.toDateString();
                  
                  return (
                    <tr key={idx} className={`hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center border ${isToday ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                            <span className={`text-[10px] font-bold uppercase ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                              {dateObj.toLocaleDateString('en-IN', { month: 'short' })}
                            </span>
                            <span className={`text-lg font-bold leading-none ${isToday ? 'text-blue-700' : 'text-gray-800'}`}>
                              {dateObj.getDate()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 flex items-center gap-2">
                              {dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              {isToday && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold uppercase tracking-wide">Today</span>}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dateObj.toLocaleDateString('en-IN', { weekday: 'long' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${badge.bg}`}>
                          {badge.icon}
                          {item.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.timeIn ? (
                          <div className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <FaClock className="text-gray-400" size={12} />
                            {new Date(item.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.timeOut ? (
                          <div className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <FaClock className="text-gray-400" size={12} />
                            {new Date(item.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-[11px] font-semibold uppercase tracking-wider border border-gray-200">
                          {item.source || 'Manual'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;
