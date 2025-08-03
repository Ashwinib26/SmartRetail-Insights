import React, { useState, useEffect } from "react";
import axios from 'axios';

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingDots, setTypingDots] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setTypingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setLoading(true);
    setReply("");
    setLastPrompt(trimmed);

    try {
      const res = await axios.post("http://localhost:5000/chat", { message: trimmed });

      if (res.status !== 200) {
        throw new Error(res.data?.reply || "Unknown server error");
      }

      setReply(res.data.reply);
    } catch (err) {
      console.error("Error while sending message:", err);
      setReply(`⚠️ Error: ${err.message}`);
    } finally {
      setLoading(false);
      setMessage(""); // Clear input field
    }
  };

  const refreshResponse = async () => {
    if (!lastPrompt) return;

    setLoading(true);
    setReply("");

    try {
      const res = await axios.post("http://localhost:5000/chat", { message: lastPrompt });

      if (res.status !== 200) {
        throw new Error(res.data?.reply || "Unknown server error");
      }

      setReply(res.data.reply);
    } catch (err) {
      console.error("Error while refreshing response:", err);
      setReply(`⚠️ Error: ${err.message}`);
    } finally {
      setLoading(false);
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
        <button onClick={handleSend} style={styles.button} title="Send">
          🚀
        </button>
        <button onClick={refreshResponse} style={styles.button} title="Refresh">
          🔄
        </button>
      </div>

      <div style={styles.responseBox}>
        {loading ? (
          <p style={styles.typing}>⏳ Thinking{typingDots}</p>
        ) : (
          reply && <p style={styles.response}>{reply}</p>
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
    fontSize: "1.2rem",
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
