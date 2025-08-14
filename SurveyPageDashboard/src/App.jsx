import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [states, setStates] = useState([]);
  const [selectedLink, setSelectedLink] = useState("");
 

  // Load states from backend API
  useEffect(() => {
    fetch("https://localhost:7033/api/LandSurvey")
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error("Error loading states:", err));
  }, []);

  const loadWebsite = () => {
    if (!selectedLink) {
      alert("Please select a state or union territory first.");
      return;
    }
    window.open(selectedLink, "_blank");

    
  };

  return (
    <div className="container">
      <div className="header">Land Records Survey Portal</div>

      <div className="input-container">
        <div className="input-row">
          <label htmlFor="inputname">Owner's Name :</label>
          <input className="inputname" id="inputname" />
        </div>
        <div className="input-row">
          <label htmlFor="inputnumber">Plot / Survey No. :</label>
          <input className="inputnumber" id="inputnumber" />
        </div>
      </div>

      <div className="action-row">
        <select
          value={selectedLink}
          onChange={(e) => setSelectedLink(e.target.value)}
        >
          <option value="">Select a State / UT</option>
          {states.map((state) => (
            <option key={state.id} value={state.website}>
              {state.name}
            </option>
          ))}
        </select>
        <button onClick={loadWebsite}>Continue</button>
      </div>
    </div>
  );
}

export default App;