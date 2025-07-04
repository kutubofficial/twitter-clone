import React, { useState, useEffect } from "react";
import "../../pages.css"
import { useUserAuth } from "../../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AvatarSelector from "../../../Avatar/AvatarSelector";
import Post from "../Posts/posts";
import Editprofile from "../Editprofile/Editprofile";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import "./Mainprofile.css";

const Mainprofile = ({ user }) => {
  const navigate = useNavigate();
  const { authUser } = useUserAuth();
  const [loggedinuser] = useLoggedinuser();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const username = user?.email?.split("@")[0];

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/userpost?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => setPosts(data));
    }
  }, [user?.email]);

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="profilePage">
      <div className="profileHeader">
        <ArrowBackIcon
          className="arrow-icon"
          onClick={handleBackClick}
          style={{ cursor: "pointer" }}
        />
        <div style={{ marginLeft: "20px" }}>
          <h2 style={{ margin: 0 }}>
            {loggedinuser[0]?.name || user?.displayName || "User"}
          </h2>
          <p style={{ margin: 0, color: "#657786" }}>
            {posts.length} {posts.length === 1 ? "Tweet" : "Tweets"}
          </p>
        </div>
      </div>

      <div className="profileContent">
        <div className="coverPhotoContainer">
          <div
            className="coverPhoto"
            style={{
              backgroundImage: `url(${
                loggedinuser[0]?.coverimage ||
                "https://pbs.twimg.com/profile_banners/1327288123518103552/1609343255/1500x500"
              })`,
              height: "200px",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="profileInfoSection">
          <div
            className="avatarContainer"
            onClick={() => setIsAvatarModalOpen(true)}
          >
            <img
              src={
                user?.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="profileAvatar"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "4px solid white",
                marginTop: "-60px",
                cursor: "pointer",
              }}
            />
          </div>

          <div className="profileActions">
            <Editprofile user={user} loggedinuser={loggedinuser} />
          </div>

          <div className="userDetails">
            <h2>{loggedinuser[0]?.name || user?.displayName || "User"}</h2>
            <p className="username">@{username}</p>

            {loggedinuser[0]?.bio && (
              <p className="userBio">{loggedinuser[0].bio}</p>
            )}

            <div className="userMeta">
              {loggedinuser[0]?.location && (
                <span className="metaItem">
                  <i className="locationIcon"></i> {loggedinuser[0].location}
                </span>
              )}
              {loggedinuser[0]?.website && (
                <a
                  href={loggedinuser[0].website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="metaItem"
                >
                  <i className="linkIcon"></i> {loggedinuser[0].website}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="profileTabs">
          <button className="profileTab active">Tweets</button>
          <button className="profileTab">Replies</button>
          <button className="profileTab">Media</button>
          <button className="profileTab">Likes</button>
        </div>

        <div className="profilePosts">
          {posts.map((post) => (
            <Post key={post._id} p={post} />
          ))}
        </div>
      </div>

      <AvatarSelector
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={user?.photoURL}
      />
    </div>
  );
};

export default Mainprofile;
