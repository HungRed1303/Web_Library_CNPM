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
    <div className="w-full max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center text-[#033060] mb-8" style={{ fontFamily: 'Tahoma, sans-serif', letterSpacing: 1 }}>
            LIBRARY REPORTS
          </h1>
      <div className="flex flex-col gap-8">
        <ReportFilter filters={filters} setFilters={setFilters} onGenerate={() => setShowTable(true)} />
        {showTable && (
          <div className="bg-white rounded-xl border border-[#033060] shadow-[0_0_15px_rgba(3,48,96,0.5)] p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#033060]" style={{ fontFamily: 'Tahoma, sans-serif' }}>Report Results</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="border border-[#033060] rounded-md px-8 py-3 text-[#033060] bg-white hover:bg-[#f3f6fa] transition font-semibold shadow-sm text-center flex items-center justify-center"
                  style={{ minWidth: 150 }}
                >
                  Export CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  className="border border-[#033060] rounded-md px-8 py-3 text-[#033060] bg-white hover:bg-[#f3f6fa] transition font-semibold shadow-sm text-center flex items-center justify-center"
                  style={{ minWidth: 150 }}
                >
                  Export PDF
                </button>
              </div>
            </div>
            <ReportTable data={filteredData} />
          </div>
        )}
      </div>
    </div>
  )
}