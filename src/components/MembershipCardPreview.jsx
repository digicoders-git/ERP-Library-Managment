import React, { useRef, useState } from 'react';
import { FaTimes, FaPrint, FaDownload, FaUserCircle, FaBook } from 'react-icons/fa';
import html2canvas from 'html2canvas';

const MembershipCardPreview = ({ member, libraryName = "Library Management", logo, onClose }) => {
  const cardRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState('official'); // 'official' or 'modern'

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
      const link = document.createElement('a');
      link.download = `LibraryCard_${member.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating card image:', error);
    }
  };

  const handlePrint = () => {
    const printContent = cardRef.current;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Library Card</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              font-family: sans-serif;
              background-color: #f3f4f6;
            }
            .print-container {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @media print {
              @page { margin: 0; size: auto; }
              body { padding: 0; margin: 20px; background-color: white; }
            }
          </style>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div class="print-container">
            ${printContent.outerHTML}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!member) return null;

  // Format the name of the library/branch based on text length to split into lines if needed
  const nameParts = libraryName.split(',').map(part => part.trim());
  const mainName = nameParts[0] || "School Library";
  const subName = nameParts.slice(1).join(', ') || "Library Management System";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">Membership Card Preview</h2>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => setSelectedTemplate('official')}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition ${selectedTemplate === 'official' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
              >
                Government Style
              </button>
              <button 
                onClick={() => setSelectedTemplate('modern')}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition ${selectedTemplate === 'modern' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
              >
                Modern Wave Style
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        {/* --- Card Visual Design --- */}
        <div className="flex justify-center mb-8">
          {selectedTemplate === 'official' ? (
            <div 
              ref={cardRef} 
              className="relative w-[500px] h-[310px] bg-white rounded-lg overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-300 flex flex-col"
              style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f5f5f5' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M50 0L100 50L50 100L0 50z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '120px 120px'
              }}
            >
              {/* Top Banner Area */}
              <div className="relative w-full h-[75px] bg-white border-b-2 border-[#1a3b6e] flex items-center px-4 z-20 shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#1a3b6e]"></div>
                <div className="absolute top-0 right-0 w-[180px] h-full overflow-hidden">
                  <div className="absolute top-[-20px] right-[-30px] w-[150px] h-[150px] bg-[#1a3b6e] rounded-full"></div>
                  <div className="absolute top-[10px] right-[-10px] w-[120px] h-[120px] bg-[#3a71b8] rounded-full opacity-90"></div>
                  <div className="absolute top-[30px] right-[10px] w-[90px] h-[90px] bg-[#5ba0db] rounded-full opacity-80"></div>
                </div>

                <div className="flex-shrink-0 z-10 mr-3">
                  <div className="w-[60px] h-[60px] bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-inner overflow-hidden relative">
                   {logo ? (
                     <img 
                      src={logo.startsWith('http') ? logo : `http://localhost:5002${logo.startsWith('/') ? '' : '/'}${logo}`} 
                      alt="Logo" 
                      className="w-full h-full object-contain p-1" 
                    />
                   ) : (
                       <div className="w-[45px] h-[45px] border border-dashed border-gray-400 rounded-full flex items-center justify-center">
                         <span className="text-[8px] font-bold text-gray-500 text-center leading-tight">BRAND<br/>LOGO</span>
                       </div>
                     )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center z-10 mr-12 text-center">
                  <p className="text-[14px] font-medium text-gray-800 leading-tight tracking-wide uppercase">{mainName}</p>
                  <p className="text-[12px] text-gray-700 leading-tight mt-0.5">{subName}</p>
                </div>
              </div>

              <div className="w-full text-center mt-3 z-10 relative">
                <h1 className="text-[18px] font-bold text-black tracking-widest uppercase">Membership Card</h1>
              </div>

              <div className="flex-1 w-full px-6 flex items-start justify-between mt-3 z-10 relative">
                <div className="flex-1 flex flex-col justify-between h-[150px]">
                  <table className="w-full text-[14px]">
                    <tbody>
                      <tr>
                        <td className="py-1 font-semibold text-gray-900 w-[120px]">NAME</td>
                        <td className="py-1 font-bold text-black uppercase">: {member.name}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-semibold text-gray-900">ID NUMBER</td>
                        <td className="py-1 font-bold text-black uppercase">: {member.id || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-semibold text-gray-900">DATE OF BIRTH</td>
                        <td className="py-1 font-bold text-black uppercase">: {member.dob && member.dob !== 'N/A' ? new Date(member.dob).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-semibold text-gray-900">VALID TILL</td>
                        <td className="py-1 font-bold text-black uppercase">: {member.validTill && member.validTill !== 'Lifetime' ? new Date(member.validTill).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) : 'LIFETIME'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-semibold text-gray-900">PHONE NUMBER</td>
                        <td className="py-1 font-bold text-black uppercase">: {member.phone || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-semibold text-gray-900 align-top">ADDRESS</td>
                        <td className="py-1 font-bold text-black capitalize leading-tight">
                          <div className="flex">
                            <span className="mr-1">:</span>
                            <span className="truncate max-w-[170px]" title={member.address}>{member.address && member.address.length > 3 ? member.address : 'N/A'}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex items-end mt-4">
                    <span className="font-semibold text-gray-900 text-[14px] w-[120px]">SIGNATURE</span>
                    <span className="font-bold text-black mr-1">:</span>
                    <div className="flex-1 border-b-[1.5px] border-black ml-1 mb-1"></div>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0 flex items-center h-[150px]">
                  <div className="w-[110px] h-[130px] bg-white border-[1.5px] border-gray-400 p-1 flex items-center justify-center shadow-sm">
                    {member.profileImage ? (
                      <img 
                        src={member.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-end justify-center overflow-hidden border border-gray-200 relative pb-2">
                         <FaUserCircle className="text-[90px] text-gray-300 absolute bottom-[-10px]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- Modern Wave Template (New) --- */
            <div 
              ref={cardRef} 
              className="relative w-[500px] h-[310px] bg-white rounded-xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <div className="px-6 pt-5 pb-2 flex justify-between items-start relative z-10">
                <div className="max-w-[300px]">
                  <h2 className="text-[20px] font-bold text-[#1e4e8c] leading-tight mb-1">{mainName}</h2>
                  <p className="text-[14px] text-[#2c7abe] font-medium italic">Membership Card</p>
                </div>
                <div className="w-[60px] h-[60px] flex items-center justify-center">
                  {logo ? (
                     <img src={logo.startsWith('http') ? logo : `http://localhost:5002${logo.startsWith('/') ? '' : '/'}${logo}`} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <FaBook size={45} className="text-[#a3d13a]" />
                  )}
                </div>
              </div>
              <div className="relative h-[40px] w-full my-1 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[30px] bg-[#2c9fb3] opacity-80" style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 100%, 0 85%)' }}></div>
                <div className="absolute top-[8px] left-0 w-full h-[30px] bg-[#1e4e8c]" style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0 100%)' }}></div>
              </div>
              <div className="flex-1 px-8 py-2 flex items-center justify-between relative z-10">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-baseline">
                    <span className="text-[15px] font-bold text-[#1e4e8c] w-[70px]">Name:</span>
                    <span className="text-[16px] font-bold text-gray-800">{member.name}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-[15px] font-bold text-[#1e4e8c] w-[70px]">Type:</span>
                    <span className="text-[15px] font-semibold text-gray-700">{member.memberType}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-[15px] font-bold text-[#1e4e8c] w-[70px]">Address:</span>
                    <span className="text-[14px] font-medium text-gray-600 truncate max-w-[180px]">{member.address && member.address.length > 3 ? member.address : 'N/A'}</span>
                  </div>
                </div>
                <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm flex flex-col items-center">
                  <div className="w-[180px] h-[55px] flex items-center justify-center overflow-hidden">
                    <div className="flex items-center gap-[1px]">
                      {[2, 4, 1, 3, 2, 5, 2, 1, 4, 2, 1, 3, 2, 5, 1, 4, 2, 3, 1, 2, 4, 3, 2, 1, 4, 2].map((w, i) => (
                        <div key={i} className="bg-black" style={{ width: `${w}px`, height: '40px' }}></div>
                      ))}
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-gray-800 mt-1">{member.id}</span>
                </div>
              </div>
              <div className="h-4 w-full bg-gray-50 mt-auto"></div>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end mt-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
          >
            <FaPrint /> Print Card
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
          >
            <FaDownload /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipCardPreview;
