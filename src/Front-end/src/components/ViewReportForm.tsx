import { useState } from "react"
import ReportFilter from "./report-filter"
import ReportTable from "./report-table"
import { exportToCSV, exportToPDF } from "../lib/export-utils"
import { mockReportData } from "../lib/mock-data"

type ReportFilters = {
  reportType?: string;
  fromDate?: string;
  toDate?: string;
  bookType?: string;
  status?: string;
};

export default function ViewReportForm() {
  const [filters, setFilters] = useState<ReportFilters>({})
  const [showTable, setShowTable] = useState(false)

  // Filtering logic
  const filteredData = mockReportData.filter(item => {
    let match = true
    if (filters.bookType && filters.bookType !== "") {
      match = match && item.bookType === filters.bookType
    }
    if (filters.status && filters.status !== "") {
      match = match && item.status === filters.status
    }
    // Optionally filter by reportType, fromDate, toDate if needed
    return match
  })

  const handleExportCSV = () => exportToCSV(filteredData, "report")
  const handleExportPDF = () => exportToPDF(filteredData, "report")

  return (
    <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-xl border border-[#033060] shadow-[0_0_15px_rgba(3,48,96,0.5)] z-10">
      <h1 className="text-3xl font-bold text-center text-[#033060] mb-8">Library Reports</h1>
      <ReportFilter filters={filters} setFilters={setFilters} onGenerate={() => setShowTable(true)} />
      {showTable && (
        <>
          <div className="flex gap-2 mb-4">
            <button onClick={handleExportCSV} className="btn bg-blue-600 text-white px-4 py-2 rounded">Export CSV</button>
            <button onClick={handleExportPDF} className="btn bg-pink-600 text-white px-4 py-2 rounded">Export PDF</button>
          </div>
          <ReportTable data={filteredData} />
        </>
      )}
    </div>
  )
}
