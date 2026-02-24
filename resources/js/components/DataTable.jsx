import React, { useState, useEffect } from 'react';

export default function DataTable({ data, columns, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full">
      <table className="min-w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {currentData.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="hover:bg-blue-50 transition duration-200"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 text-sm text-gray-600"
                >
                  {/* Badge Column Support for statuses */}
                  {col.type === "badge" ? (
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        col.badgeColors?.[
                          row[col.key]?.toLowerCase()
                        ] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {row[col.key]}
                    </span>
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-3 space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="px-2 py-1">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}