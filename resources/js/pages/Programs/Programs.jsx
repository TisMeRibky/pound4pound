import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import CreateProgram from "./CreateProgram";
import EditProgramModal from "./ProgramProfile";
import white_circle from "@/assets/plus-circle-white.svg";
import black_circle from "@/assets/plus-circle-black.svg";

export default function Programs({ user }) {
  const [programs, setPrograms] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch programs
  const fetchPrograms = () => {
    fetch("/api/programs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPrograms(data.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Program Name",
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
    },
  ];

  return (
    <div className="flex">
      <main className="flex-1 p-5">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1
            style={{ fontFamily: "var(--font-verdana)" }}
            className="text-2xl font-bold leading-none"
          >
            Programs
          </h1>

          {/* Add Program Button */}
          <button
            onClick={() => setShowCreate(true)}
            className="bg-[#03023B] font-verdana text-white px-4 h-10 flex items-center justify-center rounded mt-5 gap-2 relative group hover:text-black hover:bg-[#FFDE59]"
          >
            Add Program
            <span className="w-5 h-5 relative inline-block">
              <img
                src={white_circle}
                alt="white circle"
                className="absolute top-0 left-0 w-5 h-5 opacity-100 group-hover:opacity-0"
              />
              <img
                src={black_circle}
                alt="black circle"
                className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100"
              />
            </span>
          </button>
        </div>

        {/* Data Table */}
        <DataTable
          data={programs}
          columns={columns}
          itemsPerPage={10}
          onRowClick={(row) => setSelectedProgram(row)}
        />

        {/* Create Program Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={() => setShowCreate(false)}
              >
                ✖
              </button>

              <CreateProgram
                token={token}
                onSuccess={() => {
                  fetchPrograms();
                  setShowCreate(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Edit Program Modal */}
        {selectedProgram && (
          <EditProgramModal
            program={selectedProgram}
            token={token}
            onClose={() => setSelectedProgram(null)}
            onSuccess={() => {
              fetchPrograms();
              setSelectedProgram(null);
            }}
          />
        )}

      </main>
    </div>
  );
}