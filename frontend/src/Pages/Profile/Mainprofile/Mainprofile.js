import React, { useState, useEffect } from "react";
import Post from "../Posts/posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Editprofile from "../Editprofile/Editprofile";
import axios from "axios";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import AvatarModal from "../../.././Avatar/AvatarSelector";
import { BASE_URL } from "../../../config/api";

const Mainprofile = ({ user }) => {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [loggedinuser] = useLoggedinuser();
  const username = user?.email?.split("@")[0];
  const [post, setpost] = useState([]);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/userpost?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
      });
  }, [user.email]);

  const handleuploadcoverimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const usercoverimage = {
          email: user?.email,
          coverimage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`${BASE_URL}/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(usercoverimage),
          });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };

  const handleuploadprofileimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userprofileimage = {
          email: user?.email,
          profileImage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`${BASE_URL}/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userprofileimage),
          });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };

  const handleChooseAvatar = (avatarUrl) => {
    setisloading(true);
    fetch(`${BASE_URL}/userupdate/${user?.email}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: user.email, profileImage: avatarUrl }),
    })
      .then((res) => res.json())
      .then(() => {
        setisloading(false);
        setShowAvatarModal(false);
      });
  };

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          <div>
            <div className="coverImageContainer">
              <img
                src={
                  loggedinuser[0]?.coverimage
                    ? loggedinuser[0].coverimage
                    : user?.photoURL
                }
                alt=""
                className="coverImage"
              />
              <div className="hoverCoverImage">
                <div className="imageIcon_tweetButton">
                  <label htmlFor="image" className="imageIcon">
                    {isloading ? (
                      <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                      <CenterFocusWeakIcon className="photoIcon" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="imageInput"
                    onChange={handleuploadcoverimage}
                  />
                </div>
              </div>
            </div>

            <div className="avatar-img">
              <div className="avatarContainer">
                <img
                  src={
                    loggedinuser[0]?.profileImage
                      ? loggedinuser[0].profileImage
                      : user?.photoURL
                  }
                  alt=""
                  className="avatar"
                />
                <div className="hoverAvatarImage">
                  <div className="imageIcon_tweetButton">
                    <label
                      className="imageIcon"
                      onClick={() => setShowAvatarModal(true)}
                    >
                      {isloading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <AvatarModal
                isOpen={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                onUpload={handleuploadprofileimage}
                onAvatarSelect={handleChooseAvatar}
                username={username}
              />

              <div className="userInfo">
                <div>
                  <h3 className="heading-3">
                    {loggedinuser[0]?.name
                      ? loggedinuser[0].name
                      : user?.displayName}
                  </h3>
                  <p className="usernameSection">@{username}</p>
                </div>
                <Editprofile user={user} loggedinuser={loggedinuser} />
              </div>

              <div className="infoContainer">
                {loggedinuser[0]?.bio && <p>{loggedinuser[0].bio}</p>}
                <div className="locationAndLink">
                  {loggedinuser[0]?.location && (
                    <p className="suvInfo">
                      <MyLocationIcon /> {loggedinuser[0].location}
                    </p>
                  )}
                  {loggedinuser[0]?.website && (
                    <p className="subInfo link">
                      <AddLinkIcon /> {loggedinuser[0].website}
                    </p>
                  )}
                </div>
              </div>
              <h4 className="tweetsText">Tweets</h4>
              <hr />
            </div>

            <div className="profileTabs">
              <button className="profileTab active">Tweets</button>
              <button className="profileTab">Replies</button>
              <button className="profileTab">Media</button>
              <button className="profileTab">Likes</button>
            </div>

            {post?.map((p) => (
              <Post key={p._id} p={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainprofile;
