import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import "./LoginHistory.css"

const LoginHistory = () => {
  const { user } = useUserAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/login-history?email=${user.email}`
        );
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("Failed to load login history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.email]);

  return (
    <div className="login-history-container">
      <div className="login-history-header">
        <h2>Login History</h2>
      </div>

      <div className="login-history-content">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : history.length === 0 ? (
          <div className="empty-state">No login history found.</div>
        ) : (
          history.map((log, idx) => (
            <div className="history-entry" key={idx}>
              <div className="entry-row">
                <span className="entry-label">Date:</span>
                <span>{new Date(log.loginTime).toLocaleString()}</span>
              </div>
              <div className="entry-row">
                <span className="entry-label">Browser:</span>
                <span>{log.browser}</span>
              </div>
              <div className="entry-row">
                <span className="entry-label">OS:</span>
                <span>{log.os}</span>
              </div>
              <div className="entry-row">
                <span className="entry-label">Device:</span>
                <span>{log.deviceType}</span>
              </div>
              <div className="entry-row">
                <span className="entry-label">IP:</span>
                <span>{log.ipAddress || "N/A"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoginHistory;
