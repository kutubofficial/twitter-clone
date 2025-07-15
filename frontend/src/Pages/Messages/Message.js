import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import "../pages.css";
import "./message.css";
const Message = () => {
  return (
    <div className="notification-page">
      <div className="container">
        <h2>Messages</h2>
        <UnsubscribeIcon/>
      </div>
      <hr />
      <div className="no-notifications">
        <h4>No Messages</h4>
      </div>
    </div>
  );
};

export default Message;
