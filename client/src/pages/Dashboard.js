import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ThreeDChart from "../components/ThreeDChart";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

function Dashboard({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [xAxis, setXAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [numericKeys, setNumericKeys] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("User");
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [workbookRef, setWorkbookRef] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    if (!token) navigate("/");
    if (storedUser) setUsername(storedUser);

    if (token) fetchHistory();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please upload a valid Excel file");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      setWorkbookRef(workbook);
      setSheetNames(workbook.SheetNames);
      setSelectedSheet(workbook.SheetNames[0]);

      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      processSheetData(sheetData);
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const processSheetData = (sheetData) => {
    setData(sheetData);
    const columns = Object.keys(sheetData[0] || {});
    setAllColumns(columns);
    setXAxis(columns[0]);
    const numericCols = columns.filter((key) => typeof sheetData[0][key] === "number");
    setNumericKeys(numericCols);

    const calculatedStats = {};
    numericCols.forEach((key) => {
      const values = sheetData.map((row) => row[key]);
      calculatedStats[key] = {
        sum: values.reduce((a, b) => a + b, 0),
        avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });
    setStats(calculatedStats);

    fetchAISummary(sheetData, numericCols);
  };

  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName);
    if (!workbookRef) return;
    const sheetData = XLSX.utils.sheet_to_json(workbookRef.Sheets[sheetName]);
    processSheetData(sheetData);
  };

  const pieData = numericKeys.map((key) => ({
    name: key,
    value: data.reduce((sum, row) => sum + (row[key] || 0), 0),
  }));

  const fetchAISummary = async (sheetData, numericCols) => {
    if (!sheetData.length || !numericCols.length) return;

    const numericData = {};
    numericCols.forEach((key) => {
      numericData[key] = sheetData.map((row) => row[key] || 0);
    });

    setLoadingAI(true);
    try {
      const res = await fetch("http://localhost:5001/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numericData }),
      });
      const result = await res.json();
      setAiSummary(result.summary || "No summary available.");
    } catch (err) {
      console.error(err);
      setAiSummary("Failed to generate AI summary.");
    }
    setLoadingAI(false);
  };

  const downloadExcel = () => {
    if (!data || !stats) return;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "OriginalData");

    const wsStatsData = [["Column", "Sum", "Average", "Min", "Max"]];
    numericKeys.forEach((key) => {
      wsStatsData.push([key, stats[key].sum, stats[key].avg, stats[key].min, stats[key].max]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(wsStatsData), "SummaryStats");

    if (aiSummary) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["AI Summary"], [aiSummary]]), "AISummary");
    }

    XLSX.writeFile(wb, "Excel_Report.xlsx");
  };

  const downloadCSV = () => {
    if (!data) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Excel_Data.csv";
    link.click();
  };

  const clearData = () => {
    setData([]);
    setStats(null);
    setAllColumns([]);
    setNumericKeys([]);
    setXAxis("");
    setSheetNames([]);
    setSelectedSheet("");
    setWorkbookRef(null);
    setAiSummary("");
  };

  const saveToHistory = async () => {
    if (!data.length || !stats) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ timestamp: new Date(), data, stats, aiSummary }),
      });
      if (res.ok) fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setHistory(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <Header title="📊 Excel Analytics Platform" onLogout={handleLogout} />
        <main style={styles.main}>

          {/* Welcome Card */}
          <section style={{ ...styles.card, background: "linear-gradient(135deg, #6C63FF, #8E2DE2)", color: "white" }}>
            <h2>Welcome, {username} 👋</h2>
            <p>This is your Excel Analytics Dashboard.</p>
          </section>

          {/* Upload Card */}
          <section style={styles.card}>
            <h3>Upload Excel File</h3>
            <input type="file" onChange={handleFileChange} />
            {loading && <p style={{ color: "blue" }}>⏳ Processing file...</p>}
            {sheetNames.length > 1 && (
              <div style={{ marginTop: "10px" }}>
                <label>Choose Sheet:</label>
                <select value={selectedSheet} onChange={(e) => handleSheetChange(e.target.value)}>
                  {sheetNames.map((sheet, idx) => <option key={idx} value={sheet}>{sheet}</option>)}
                </select>
              </div>
            )}
          </section>

          {/* Reports Card */}
          <section style={styles.card}>
            <h3>Reports</h3>
            {data.length > 0 ? (
              <>
                <div>
                  <label>
                    X-axis:
                    <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} style={styles.select}>
                      {allColumns.map((col, idx) => <option key={idx} value={col}>{col}</option>)}
                    </select>
                  </label>

                  <label style={{ marginLeft: "10px" }}>
                    Chart Type:
                    <select value={chartType} onChange={(e) => setChartType(e.target.value)} style={styles.select}>
                      <option value="bar">Bar</option>
                      <option value="line">Line</option>
                      <option value="pie">Pie</option>
                      <option value="3d">3D Bar</option>
                    </select>
                  </label>

                  {stats && (
                    <>
                      <button onClick={downloadExcel} style={styles.downloadBtn}>📥 Excel</button>
                      <button onClick={downloadCSV} style={{ ...styles.downloadBtn, backgroundColor: "#FF5722" }}>📄 CSV</button>
                      <button onClick={saveToHistory} style={{ ...styles.downloadBtn, backgroundColor: "#4CAF50" }}>💾 Save History</button>
                      <button onClick={clearData} style={{ ...styles.downloadBtn, backgroundColor: "#999" }}>❌ Clear</button>
                    </>
                  )}
                </div>

                {/* Summary Stats Table */}
                {stats && (
                  <div style={{ marginTop: "20px" }}>
                    <h4>Summary Statistics</h4>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>Column</th>
                          <th>Sum</th>
                          <th>Avg</th>
                          <th>Min</th>
                          <th>Max</th>
                        </tr>
                      </thead>
                      <tbody>
                        {numericKeys.map((key, i) => (
                          <tr key={i}>
                            <td>{key}</td>
                            <td>{stats[key].sum}</td>
                            <td>{stats[key].avg}</td>
                            <td>{stats[key].min}</td>
                            <td>{stats[key].max}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Chart Display */}
                <div style={{ width: "100%", height: 400, marginTop: "20px" }}>
                  {chartType === "3d" ? (
                    <ThreeDChart data={data} numericKeys={numericKeys} xAxis={xAxis} />
                  ) : (
                    <ResponsiveContainer>
                      {chartType === "bar" && (
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey={xAxis} />
                          <YAxis />
                          <Tooltip formatter={(value) => value.toLocaleString()} />
                          <Legend />
                          {numericKeys.map((key, idx) => (
                            <Bar key={idx} dataKey={key} fill={COLORS[idx % COLORS.length]} animationDuration={800} />
                          ))}
                        </BarChart>
                      )}
                      {chartType === "line" && (
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey={xAxis} />
                          <YAxis />
                          <Tooltip formatter={(value) => value.toLocaleString()} />
                          <Legend />
                          {numericKeys.map((key, idx) => (
                            <Line key={idx} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} animationDuration={800} />
                          ))}
                        </LineChart>
                      )}
                      {chartType === "pie" && (
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                            {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(value) => value.toLocaleString()} />
                          <Legend />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  )}
                </div>

                {/* AI Summary Card */}
                <section style={{ ...styles.card, backgroundColor: "#f7f7f7", marginTop: "20px" }}>
                  <h4>🤖 AI Summary</h4>
                  {loadingAI ? <p>Generating AI summary...</p> : <p>{aiSummary || "No summary available."}</p>}
                  <button 
                    style={{ ...styles.downloadBtn, backgroundColor: "#03A9F4", marginTop: "10px" }} 
                    onClick={() => fetchAISummary(data, numericKeys)}
                  >
                    🔄 Regenerate AI Summary
                  </button>
                </section>

                {/* History Table */}
                {history.length > 0 && (
                  <div style={{ marginTop: "30px" }}>
                    <h4>Analysis History</h4>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Columns</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((entry, i) => (
                          <tr key={i}>
                            <td>{new Date(entry.timestamp).toLocaleString()}</td>
                            <td>{Object.keys(entry.stats).join(", ")}</td>
                            <td>
                              <button
                                onClick={() => processSheetData(entry.data)}
                                style={{ ...styles.downloadBtn, backgroundColor: "#03A9F4" }}
                              >
                                🔄 Load
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </>
            ) : (
              <p>Upload an Excel file to see charts and summary statistics.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "Inter, Arial, sans-serif", backgroundColor: "#f0f2f5" },
  content: { flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" },
  main: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", padding: "2rem" },
  card: { 
    backgroundColor: "white", padding: "1.5rem", borderRadius: "14px", boxShadow: "0 8px 20px rgba(0,0,0,0.12)", 
    minHeight: "250px", transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "default",
    ":hover": { transform: "translateY(-5px)", boxShadow: "0 12px 25px rgba(0,0,0,0.15)" }
  },
  table: { borderCollapse: "collapse", width: "100%", minWidth: "400px", textAlign: "center", marginTop: "10px" },
  select: { marginLeft: "5px", padding: "5px", borderRadius: "5px" },
  downloadBtn: { marginLeft: "10px", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", backgroundColor: "#6C63FF", color: "white", border: "none" },
};

export default Dashboard;
