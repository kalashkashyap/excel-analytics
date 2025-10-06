import './App.css';
import ExcelUpload from './ExcelUpload'; // Import the ExcelUpload component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Excel Analytics Platform</h1>
        <ExcelUpload /> {/* Render the Excel upload component */}
      </header>
    </div>
  );
}

export default App;
