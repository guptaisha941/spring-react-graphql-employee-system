import { useState } from 'react'
import { FaDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa'
import logger from '../utils/logger'

const Reports = () => {
  const [reports] = useState([
    { id: 1, title: 'Monthly Employee Report', date: '2026-02-01', type: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Department Performance', date: '2026-02-15', type: 'Excel', size: '1.8 MB' },
    { id: 3, title: 'Attendance Summary', date: '2026-02-10', type: 'PDF', size: '950 KB' },
    { id: 4, title: 'Payroll Report', date: '2026-02-05', type: 'Excel', size: '3.2 MB' },
  ])

  const [downloadingId, setDownloadingId] = useState(null)

  const handleDownload = async (report) => {
    setDownloadingId(report.id)
    
    // Simulate download (in real app, this would fetch from backend)
    setTimeout(() => {
      try {
        // Create proper file content based on type
        let content = ''
        let mimeType = 'text/plain'
        let fileExtension = 'txt'
        
        if (report.type === 'PDF') {
          // For PDF, we'll create a text file that explains it's a demo
          // In production, this would be a real PDF blob from backend
          content = `DEMO REPORT - ${report.title}\n\n`
          content += `This is a demonstration report.\n`
          content += `In production, this would be a real PDF file generated from backend data.\n\n`
          content += `Report Details:\n`
          content += `- Title: ${report.title}\n`
          content += `- Date: ${report.date}\n`
          content += `- Size: ${report.size}\n\n`
          content += `Note: This is mock data for demonstration purposes.`
          mimeType = 'text/plain'
          fileExtension = 'txt'
        } else if (report.type === 'Excel') {
          // For Excel, create CSV format (can be opened in Excel)
          content = `Report Title,Date,Type,Size\n`
          content += `${report.title},${report.date},${report.type},${report.size}\n\n`
          content += `Note: This is a demo CSV file. In production, this would be a real Excel file.`
          mimeType = 'text/csv'
          fileExtension = 'csv'
        } else {
          content = `DEMO REPORT - ${report.title}\n\n`
          content += `This is a demonstration report.\n`
          content += `Report Details:\n`
          content += `- Title: ${report.title}\n`
          content += `- Date: ${report.date}\n`
          content += `- Type: ${report.type}\n`
          content += `- Size: ${report.size}\n`
          mimeType = 'text/plain'
          fileExtension = 'txt'
        }
        
        // Create blob with proper MIME type
        const blob = new Blob([content], { type: mimeType })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${report.title.replace(/\s+/g, '_')}_DEMO.${fileExtension}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        setDownloadingId(null)
      } catch (error) {
        logger.error('Download error:', error)
        setDownloadingId(null)
        alert('Download failed. This is a demo feature.')
      }
    }, 1000)
  }

  const getFileIcon = (type) => {
    return type === 'PDF' ? FaFilePdf : FaFileExcel
  }

  const getFileColor = (type) => {
    return type === 'PDF' ? 'text-red-600' : 'text-green-600'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
        <p className="text-gray-600">
          View and download system reports. 
          <span className="text-sm text-gray-500 ml-2">(Demo: Mock data - Download functionality simulated)</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => {
              const FileIcon = getFileIcon(report.type)
              const fileColor = getFileColor(report.type)
              
              return (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <FileIcon className={`text-xl ${fileColor}`} />
                      <span className="text-sm font-medium text-gray-900">{report.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDownload(report)}
                      disabled={downloadingId === report.id}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FaDownload className={downloadingId === report.id ? 'animate-bounce' : ''} />
                      <span>{downloadingId === report.id ? 'Downloading...' : 'Download'}</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports
