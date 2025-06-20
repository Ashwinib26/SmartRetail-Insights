import React, { useState, useEffect } from 'react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80',
    caption: 'Boost Sales with Smart Forecasts'
  },
  {
    url: 'https://images.unsplash.com/photo-1647507489301-7bc58ede1b32?q=80&w=2070&auto=format&fit=crop',
    caption: 'Real-Time Inventory Insights'
  },
  {
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1350&q=80',
    caption: 'Smart Retail Solutions for Business'
  }
];

function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        📊 Welcome to SmartRetail Insights!
      </h1>
      <p style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.1rem" }}>
        Your smart solution for predictive sales and intelligent inventory management.
      </p>

      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <img
          src={images[current].url}
          alt="Retail Banner"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.5s ease'
          }}
        />
        <div
          style={{
            marginTop: '16px',
            backgroundColor: '#1e272e',
            color: '#ffffff',
            display: 'inline-block',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          {images[current].caption}
        </div>
      </div>
    </div>
  );
}

export default Home;
