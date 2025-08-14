import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [states, setStates] = useState([]);
  const [selectedLink, setSelectedLink] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7033/api/LandSurvey")
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error("Error loading states:", err));
  }, []);

  const loadWebsite = () => {
    if (!selectedLink) {
      alert("Please select a state first.");
      return;
    }
    window.open(selectedLink, "_blank");
  };

  const handleValidate = async () => {
    if (!file) {
      alert("Please upload a PDF or image.");
      return;
    }

    const formData = new FormData();
    formData.append("ownerName", ownerName);
    formData.append("plotNumber", plotNumber);
    formData.append("file", file);

    const res = await fetch("https://localhost:7033/api/FileValidation/validate", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="container">
      <div className="header">Land Records Survey Portal</div>

      <div className="input-container">
        <div className="input-row">
          <label>Owner's Name :</label>
          <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
        </div>
        <div className="input-row">
          <label>Plot / Survey No. :</label>
          <input value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)} />
        </div>
      </div>

      <div className="action-row">
        <select value={selectedLink} onChange={(e) => setSelectedLink(e.target.value)}>
          <option value="">Select a State / UT</option>
          {states.map((state) => (
            <option key={state.id} value={state.website}>
              {state.name}
            </option>
          ))}
        </select>
        <button onClick={loadWebsite}>Continue</button>
      </div>

      <div className="input-row" style={{ marginTop: "15px" }}>
        <label>Upload Result (PDF/Image):</label>
        <input type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <button onClick={handleValidate} style={{ marginTop: "10px" }}>Validate</button>

      {result && (
        <div style={{ marginTop: "15px", color: result.isValid ? "lightgreen" : "red" }}>
          <b>{result.message}</b>
          <pre style={{ whiteSpace: "pre-wrap", color: "white" }}>{result.extractedText}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
