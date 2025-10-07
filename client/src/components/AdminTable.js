// src/components/AdminTable.js
import React, { useState } from "react";

function AdminTable({ columns, data }) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    columns.some((col) =>
      String(item[col.accessor]).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div style={{ background: "#fff", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          width: "100%",
          borderRadius: "5px",
          border: "1px solid #e5e7eb",
        }}
      />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead style={{ backgroundColor: "#f3f4f6" }}>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} style={{ padding: "0.75rem" }}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb", transition: "background 0.2s", cursor: "default" }}>
                {columns.map((col) => (
                  <td key={col.accessor} style={{ padding: "0.75rem" }}>
                    {col.format ? col.format(row[col.accessor]) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;
