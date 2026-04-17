import { useState, useEffect } from 'react';
import { FaClipboardList, FaChartBar, FaCog, FaSun, FaMoon, FaCloud, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const Transactions = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction Management</h2>
      <p className="text-gray-600">Track book issues, returns, and transaction history.</p>
    </div>
  </div>
);

export const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      libraryName: 'Central Library System',
      maxBooksPerMember: 3,
      loanPeriodDays: 14,
      finePerDay: 5,
      maxRenewalTimes: 2,
      emailNotifications: true,
      smsNotifications: false,
      autoReminders: true,
      theme: 'light',
      font: 'sans'
    };
  });

  useEffect(() => {
    document.body.className = `theme-${settings.theme} font-${settings.font}`;
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const themes = [
    { id: 'light', name: 'Light Mode', icon: FaSun, color: 'bg-white' },
    { id: 'dark', name: 'Dark Mode', icon: FaMoon, color: 'bg-gray-800' },
    { id: 'cool', name: 'Ocean Cool', icon: FaCloud, color: 'bg-blue-100' },
    { id: 'warm', name: 'Valley Warm', icon: FaSun, color: 'bg-orange-100' }
  ];

  const fonts = [
    { id: 'sans', name: 'Modern Sans', preview: 'Aa' },
    { id: 'serif', name: 'Classic Serif', preview: 'Aa' },
    { id: 'mono', name: 'Developer Mono', preview: 'Aa' },
    { id: 'poppins', name: 'Poppins', preview: 'Aa' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings and Preferences saved successfully!');
  };

  return (
    <div className="p-6 transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">System Settings</h1>
          <p className="text-gray-600">Personalize your experience and system policies</p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all font-bold flex items-center"
        >
          <FaCog className="mr-2" /> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Appearance */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <h3 className="text-xl font-bold flex items-center">
                <FaChartBar className="mr-2" /> Visual Appearance
              </h3>
            </div>
            <div className="p-8 space-y-8">
              {/* Theme Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Interface Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {themes.map((t) => {
                    const ThemeIcon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSettingChange('theme', t.id)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${settings.theme === t.id
                          ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                          : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center shadow-inner border border-gray-200`}>
                          <ThemeIcon className={settings.theme === t.id ? 'text-blue-600' : 'text-gray-500'} />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Typography Style</label>
                <div className="grid grid-cols-2 gap-4">
                  {fonts.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleSettingChange('font', f.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center space-x-4 ${settings.font === f.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
                        : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold bg-white border border-gray-100 shadow-sm ${f.id === 'poppins' ? 'font-poppins' : `font-${f.id}`}`}>
                        {f.preview}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-gray-800">{f.name}</div>
                        <div className="text-xs text-gray-500">Perfect for readability</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaChartBar className="mr-2 text-indigo-600" /> Notifications & Alerts
              </h3>
            </div>
            <div className="p-8 space-y-6">
              {[
                { id: 'emailNotifications', label: 'Email Notifications', desc: 'Get updates in your inbox' },
                { id: 'smsNotifications', label: 'SMS Alerts', desc: 'Instant text updates on your phone' },
                { id: 'autoReminders', label: 'Automated Reminders', desc: 'Remind members about due dates' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <label className="text-base font-bold text-gray-800">{item.label}</label>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[item.id]}
                      onChange={(e) => handleSettingChange(item.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Configuration */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
              <h3 className="text-xl font-bold flex items-center">
                <FaCog className="mr-2" /> System Configuration
              </h3>
            </div>
            <div className="p-8 space-y-6">
              {[
                { id: 'libraryName', label: 'Establishment Name', type: 'text' },
                { id: 'maxBooksPerMember', label: 'Max Borrow Limit', type: 'number' },
                { id: 'loanPeriodDays', label: 'Standard Loan Period (Days)', type: 'number' },
                { id: 'finePerDay', label: 'Late Fine (₹ / Day)', type: 'number' },
                { id: 'maxRenewalTimes', label: 'Max Renewal Limit', type: 'number' }
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-tight">{field.label}</label>
                  <input
                    type={field.type}
                    value={settings[field.id]}
                    onChange={(e) => handleSettingChange(field.id, field.type === 'number' ? parseInt(e.target.value) : e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border-2 border-dashed border-blue-200">
            <h4 className="text-blue-800 font-bold mb-4 flex items-center">
              <FaDownload className="mr-2" /> Live Summary
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-2xl font-black text-blue-600 uppercase">{settings.theme}</div>
                <div className="text-xs text-blue-400 font-bold">ACTIVE THEME</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-2xl font-black text-indigo-600 uppercase">{settings.font}</div>
                <div className="text-xs text-indigo-400 font-bold">TYPEFACE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
