import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [states, setStates] = useState([]);
  const [selectedLink, setSelectedLink] = useState("");
  const [iframeVisible, setIframeVisible] = useState(false);

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

    setIframeVisible(true);

    // Delay to check if iframe blocked
    setTimeout(() => {
      const iframe = document.getElementById("landFrame");
      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc || iframeDoc.body.innerHTML.trim() === "") {
          throw new Error("Blocked");
        }
      } catch (err) {
        console.warn("Iframe blocked, opening in new tab:", selectedLink);
        setIframeVisible(false);
        window.open(selectedLink, "_blank");
      }
    }, 2000);
  };

  return (
    <div className="container">
      <h2>Land Records - State Portal</h2>
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
      <p className="note">
        If the site cannot be embedded, it will open in a new tab automatically.
      </p>

      {iframeVisible && (
        <iframe
          id="landFrame"
          src={selectedLink}
          title="Land Survey"
          style={{
            width: "100%",
            height: "80vh",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginTop: "15px",
          }}
        ></iframe>
      )}
    </div>
  );
}

export default App;
