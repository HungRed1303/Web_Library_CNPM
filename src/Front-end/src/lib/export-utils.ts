export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    return
  }

  // Get headers from the first item
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(","),
    // Data rows
    ...data.map((row) =>
      headers
        .map((header) => {
          // Handle values with commas by wrapping in quotes
          const value = row[header]
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(","),
    ),
  ].join("\n")

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToPDF = (data: any[], filename: string) => {
  // In a real application, you would use a library like jsPDF
  // This is a simplified version that creates a styled HTML table and prints it

  if (!data || !data.length) {
    return
  }

  // Get headers from the first item
  const headers = Object.keys(data[0])

  // Create a new window for printing
  const printWindow = window.open("", "_blank")

  if (!printWindow) {
    alert("Please allow popups to export PDF")
    return
  }

  // Create HTML content with styling
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <style>
        body {
          font-family: Tahoma, sans-serif;
          margin: 20px;
        }
        h1 {
          color: #ff69b4;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background-color: rgba(255, 105, 180, 0.2);
          color: #ff69b4;
          padding: 10px;
          text-align: left;
          border-bottom: 2px solid #ff69b4;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid rgba(255, 105, 180, 0.3);
        }
        tr:nth-child(even) {
          background-color: rgba(255, 105, 180, 0.05);
        }
      </style>
    </head>
    <body>
      <h1>LIBRARY REPORT</h1>
      <table>
        <thead>
          <tr>
            ${headers.map((header) => `<th>${header.charAt(0).toUpperCase() + header.slice(1)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              ${headers.map((header) => `<td>${row[header]}</td>`).join("")}
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `

  // Write to the new window and print
  printWindow.document.open()
  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load before printing
  printWindow.onload = () => {
    printWindow.print()
    // printWindow.close() // Uncomment to auto-close after print dialog
  }
}