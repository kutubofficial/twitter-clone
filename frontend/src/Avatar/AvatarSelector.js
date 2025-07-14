import React, { useState } from "react";
import "./AvatarModal.css";
import CloseIcon from "@mui/icons-material/Close";

const AvatarModal = ({
  isOpen,
  onClose,
  onUpload,
  onAvatarSelect,
  username,
}) => {
  const [showAvatars, setShowAvatars] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="avatar-modal-overlay">
      <div className="avatar-modal">
        <div className="avatar-modal-header">
          <h3>Set Profile Picture</h3>
          <button className="avatar-close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {!showAvatars ? (
          <div className="avatar-options">
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="avatar-btn"
            >
              Upload from device
            </button>
            <button onClick={() => setShowAvatars(true)} className="avatar-btn">
              Choose Avatar
            </button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                onUpload(e);
                onClose();
              }}
            />
          </div>
        ) : (
          <>
            <p className="avatar-sub">Choose from avatars below </p>
            <div className="avatar-grid">
              {Array.from({ length: 6 }).map((_, i) => {
                const seed = `${username}-avatar${i}`;
                const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;
                return (
                  <img
                    key={i}
                    src={avatarUrl}
                    alt={`avatar-${i}`}
                    onClick={() => onAvatarSelect(avatarUrl)}
                    className="avatar-choice"
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarModal;
