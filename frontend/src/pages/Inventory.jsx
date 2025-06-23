import React from 'react';
import { useNavigate } from 'react-router-dom';

function Inventory() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📊 Inventory Visualizer Dashboard (via Streamlit)</h1>

      <button onClick={() => navigate(-1)} style={backButtonStyle}>
        ← Back
      </button>

      <div style={iframeWrapperStyle}>
        <iframe
          src="http://localhost:8501"
          title="Streamlit Dashboard"
          width="100%"
          height="800px"
          frameBorder="0"
        />
      </div>
    </div>
  );
}

const backButtonStyle = {
  marginBottom: '1rem',
  backgroundColor: '#0984e3',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const iframeWrapperStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

export default Inventory;
