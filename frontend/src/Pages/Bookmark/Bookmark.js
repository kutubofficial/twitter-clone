import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import "../pages.css";
const Message = () => {
  return (
    <div className="notification-page">
      <div className="container">
        <h2>Bookmarks</h2>
        <SettingsIcon />
      </div>
      <hr />
      <div className="no-notifications">
        <h4>No Bookmarks</h4>
      </div>
    </div>
  );
};

export default Message;
