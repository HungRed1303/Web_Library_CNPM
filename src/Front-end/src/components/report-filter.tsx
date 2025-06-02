import React from "react";
import { FaFileAlt } from "react-icons/fa";

const reportTypes = [
  { value: "", label: "Select report type" },
  { value: "borrowed", label: "Borrowed Books" },
  { value: "borrowDate", label: "Borrow Date" },
  { value: "dueDate", label: "Due Date" },
  { value: "overdue", label: "Overdue Status" },
  { value: "userStats", label: "User Statistics" },
];

const bookTypes = [
  { value: "", label: "Select book type" },
  { value: "fiction", label: "Fiction" },
  { value: "nonfiction", label: "Non-Fiction" },
  { value: "textbook", label: "Textbook" },
];

const statuses = [
  { value: "", label: "Select status" },
  { value: "borrowed", label: "Borrowed" },
  { value: "overdue", label: "Overdue" },
  { value: "returned", label: "Returned" },
];

export default function ReportFilter({ filters, setFilters, onGenerate }: any) {
  return (
    <form
      className="mb-8 bg-white rounded-xl border border-[#033060] shadow-[0_0_15px_rgba(3,48,96,0.5)] p-6"
      onSubmit={e => {
        e.preventDefault();
        onGenerate();
      }}
    >
      <h2 className="text-xl font-bold text-[#033060] mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
        Report Filters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-1 text-[#033060] font-medium">Report Type *</label>
          <select
            required
            className="w-full rounded-md border border-[#033060] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#033060]"
            value={filters.reportType || ""}
            onChange={e => setFilters((f: any) => ({ ...f, reportType: e.target.value }))}
          >
            {reportTypes.map(rt => (
              <option key={rt.value} value={rt.value}>{rt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-[#033060] font-medium">From Date</label>
          <input
            type="date"
            className="w-full rounded-md border border-[#033060] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#033060]"
            value={filters.fromDate || ""}
            onChange={e => setFilters((f: any) => ({ ...f, fromDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="block mb-1 text-[#033060] font-medium">To Date</label>
          <input
            type="date"
            className="w-full rounded-md border border-[#033060] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#033060]"
            value={filters.toDate || ""}
            onChange={e => setFilters((f: any) => ({ ...f, toDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="block mb-1 text-[#033060] font-medium">Book Type (Optional)</label>
          <select
            className="w-full rounded-md border border-[#033060] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#033060]"
            value={filters.bookType || ""}
            onChange={e => setFilters((f: any) => ({ ...f, bookType: e.target.value }))}
          >
            {bookTypes.map(bt => (
              <option key={bt.value} value={bt.value}>{bt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-[#033060] font-medium">Status (Optional)</label>
          <select
            className="w-full rounded-md border border-[#033060] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#033060]"
            value={filters.status || ""}
            onChange={e => setFilters((f: any) => ({ ...f, status: e.target.value }))}
          >
            {statuses.map(st => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="flex items-center gap-2 bg-[#033060] text-white font-bold px-6 py-2 rounded-md shadow transition hover:bg-[#022040]"
        >
          <FaFileAlt /> Generate Report
        </button>
      </div>
    </form>
  );
}
