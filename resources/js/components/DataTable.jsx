import React, { useState, useEffect, useMemo } from "react";
import search from '@/assets/search.svg';

export default function DataTable({
  data,
  columns,
  itemsPerPage = 10,
  onRowClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset page when data or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchTerm]);

  // FILTERING
  const filteredData = useMemo(() => {
  if (!searchTerm) return data;

  return data.filter((row) =>
    columns
      .filter((col) => col.searchable !== false)
      .some((col) => {
        const value = row[col.key];
        if (!value) return false;

        return value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
  );
}, [data, searchTerm, columns]);

  // SORTING * to disable sorting for a column, set `searchable: false` in the column definition *
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null) return -1;
      if (bValue == null) return 1;

      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc"
        ? aValue - bValue
        : bValue - aValue;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-4 relative w-72">
        {/* Search Icon */}
        <img
          src={search}
          alt="Search"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        />
  

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Clear X inside input */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      <table className="min-w-full font-verdana bg-white rounded-2xl shadow-lg overflow-hidden">
        <thead className="bg-[#E6E9F5] text-[#0B0F3B]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => {
                  if (col.sortable === false) return;

                  setSortConfig((prev) => {
                    if (prev?.key === col.key) {
                      return {
                        key: col.key,
                        direction:
                          prev.direction === "asc" ? "desc" : "asc",
                      };
                    }
                    return { key: col.key, direction: "asc" };
                  });
                }}
                className={`px-6 py-3 font-verdana text-left text-sm font-semibold uppercase tracking-wider select-none ${
                  col.sortable === false
                    ? "cursor-default text-gray-400"
                    : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2">
                  {col.label}

                  {col.sortable !== false && (
                    <span className="flex flex-col text-xs leading-none">
                      <span
                        className={
                          sortConfig?.key === col.key &&
                          sortConfig.direction === "asc"
                            ? "text-black"
                            : "text-gray-400"
                        }
                      >
                        ▲
                      </span>
                      <span
                        className={
                          sortConfig?.key === col.key &&
                          sortConfig.direction === "desc"
                            ? "text-black"
                            : "text-gray-400"
                        }
                      >
                        ▼
                      </span>
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {currentData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-400"
              >
                No results found.
              </td>
            </tr>
          )}

          {currentData.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`border-b ${
                onRowClick
                  ? "cursor-pointer hover:bg-gray-100 transition"
                  : ""
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-3 text-sm text-gray-600"
                >
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
      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="px-2 py-1">
          Page {currentPage} of {totalPages || 1}
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