// frontend/src/components/DetailedInventory.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const dummyInventory = [
  { item: 'TV', stock: 5, alert: true, category: 'Electronics', location: 'Warehouse A' },
  { item: 'Laptop', stock: 20, alert: false, category: 'Electronics', location: 'Warehouse B' },
  { item: 'Refrigerator', stock: 2, alert: true, category: 'Appliances', location: 'Warehouse A' },
  { item: 'Microwave', stock: 15, alert: false, category: 'Appliances', location: 'Warehouse B' }
];

function DetailedInventory() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📦 Detailed Inventory Dashboard</h1>
      <button onClick={() => navigate(-1)} style={{
        marginBottom: '1rem',
        backgroundColor: '#0984e3',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}>← Back</button>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <thead style={{ backgroundColor: '#f1f2f6' }}>
          <tr>
            <th style={thStyle}>Item</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyInventory.map((inv, index) => (
            <tr key={index} style={{ textAlign: 'center' }}>
              <td style={tdStyle}>{inv.item}</td>
              <td style={tdStyle}>{inv.stock}</td>
              <td style={tdStyle}>{inv.category}</td>
              <td style={tdStyle}>{inv.location}</td>
              <td style={tdStyle}>
                {inv.alert ? <span style={{ color: '#d63031' }}>⚠️ Restock Needed</span> : <span style={{ color: '#00b894' }}>✅ OK</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '12px',
  borderBottom: '1px solid #ccc'
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee'
};

export default DetailedInventory;
