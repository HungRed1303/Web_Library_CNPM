interface ReportTableProps {
  data: any[];
}

const headerMap: Record<string, string> = {
  id: "ID",
  title: "Title",
  author: "Author",
  borrower: "Borrower",
  date: "Date",
  dueDate: "Due Date",
  status: "Status",
  type: "Type",
  bookType: "Book Type",
};

export default function ReportTable({ data }: ReportTableProps) {
  if (!data.length) {
    return <div className="text-center py-12 text-[#033060]">No data found.</div>;
  }
  const headers = Object.keys(data[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-[#033060]">
            {headers.map(header => (
              <th
                key={header}
                className="px-4 py-3 text-left text-sm font-bold text-[#033060] uppercase tracking-wider"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                {headerMap[header] || header.charAt(0).toUpperCase() + header.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
              {headers.map(header => (
                <td key={header} className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
