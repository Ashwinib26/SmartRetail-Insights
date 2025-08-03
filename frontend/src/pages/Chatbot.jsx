import React, { useState, useEffect } from "react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingDots, setTypingDots] = useState("");

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setTypingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.reply || "Unknown server error");
      }
      setResponse(data.reply);
    } catch (error) {
      console.error("Fetch or server error:", error);
      setResponse(error.message);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>💬 InsightBot</h1>
      <p style={styles.subheading}>
        Ask anything and unlock intelligent insights instantly.
      </p>

      <div style={styles.chatContainer}>
        <input
          type="text"
          placeholder="Type your question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          🚀 Send
        </button>
      </div>

      <div style={styles.responseBox}>
        {loading ? (
          <p style={styles.typing}>⏳ Thinking{typingDots}</p>
        ) : (
          response && <p style={styles.response}>{response}</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "700px",
    margin: "5vh auto",
    padding: "2rem",
    background: "linear-gradient(to bottom, #ffffff, #f7f9fc)",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
    transition: "all 0.3s ease-in-out",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#3c3c3c",
    marginBottom: "0.5rem",
  },
  subheading: {
    fontSize: "1rem",
    color: "#6a6a6a",
    marginBottom: "2rem",
  },
  chatContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  input: {
    flexGrow: 1,
    minWidth: "250px",
    maxWidth: "70%",
    padding: "0.8rem 1rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "12px",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  button: {
    padding: "0.8rem 1.25rem",
    backgroundColor: "#323135ff",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
  },
  responseBox: {
    backgroundColor: "#f0f2f5",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "1rem",
    minHeight: "100px",
    textAlign: "left",
    whiteSpace: "pre-wrap",
    color: "#333",
    animation: "fadeIn 0.4s ease-in-out",
  },
  response: {
    fontSize: "1rem",
    lineHeight: "1.6",
  },
  typing: {
    color: "#999",
    fontStyle: "italic",
  },
};

export default Chatbot;
