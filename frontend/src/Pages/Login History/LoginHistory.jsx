import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";

const LoginHistory = () => {
  const { user } = useUserAuth(); // Your Firebase user
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/login-history?email=${user?.email}`
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
    <div className="login-history">
      <h2>Login History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No login history found.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Browser</th>
              <th>OS</th>
              <th>Device</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {history?.map((log, idx) => (
              <tr className="login-entry" key={idx}>
                <td>{new Date(log.loginTime).toLocaleString()}</td>
                <td>{log.browser}</td>
                <td>{log.os}</td>
                <td>{log.deviceType}</td>
                <td>{log.ipAddress || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoginHistory;
