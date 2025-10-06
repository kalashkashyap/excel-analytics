import { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/file/upload', formData);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    }
  };

  // Extract numeric columns for charting
  const numericKeys = data.length
    ? Object.keys(data[0]).filter(key => typeof data[0][key] === 'number')
    : [];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Excel File</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload} style={{ marginLeft: '10px' }}>Upload</button>

      <h3>Data Preview:</h3>
      {data.length > 0 ? (
        <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key, i) => <th key={i}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => <td key={i}>{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data yet</p>
      )}

      {/* Chart */}
      {data.length > 0 && numericKeys.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h3>Data Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(data[0])[0]} /> {/* Use first column as X axis */}
              <YAxis />
              <Tooltip />
              <Legend />
              {numericKeys.map((key, idx) => (
                <Bar key={idx} dataKey={key} fill={`hsl(${idx * 50}, 70%, 50%)`} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ExcelUpload;
