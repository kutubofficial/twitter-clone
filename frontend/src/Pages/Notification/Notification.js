import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import "../pages.css";
import "./notification.css";

const Notification = () => {
  return (
    <div className="notification-page">
      <div className="container">
        <h2>Notifications</h2>
        <SettingsIcon />
      </div>
      <hr />
      <div className="no-notifications">
        <h4>No Notifications</h4>
      </div>
    </div>
  );
};

export default Notification;