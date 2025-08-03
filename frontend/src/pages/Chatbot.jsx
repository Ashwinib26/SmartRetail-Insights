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
      const res = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (!res.ok) {
        // server sent back a 4xx/5xx
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
      <h1 style={styles.heading}>InsightBot</h1>
      <p style={styles.subheading}>
        💡 Ask anything and unlock intelligent insights instantly!
      </p>

      <div style={styles.chatbox}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={styles.input}
        />
        <button
          onClick={handleSend}
          style={styles.button}
          className="chat-button"
        >
          🚀
        </button>
      </div>

      <div style={styles.responseBox} className="fade-in">
        {loading ? (
          <div style={styles.typing}>⏳ Thinking{typingDots}</div>
        ) : (
          response && <p style={styles.response}>{response}</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "600px",
    margin: "3rem auto",
    padding: "2rem",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    animation: "slideFadeIn 0.8s ease",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#4B0082",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  subheading: {
    fontSize: "1rem",
    color: "#6c757d",
    marginBottom: "2rem",
  },
  chatbox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  input: {
    flex: 1,
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    background: "#4B0082",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s ease, background 0.3s ease",
  },
  responseBox: {
    minHeight: "80px",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    border: "1px solid #eee",
    transition: "opacity 0.3s ease",
  },
  response: {
    color: "#333",
    fontSize: "1rem",
    lineHeight: "1.5",
  },
  typing: {
    fontStyle: "italic",
    color: "#999",
  },
};

export default Chatbot;
