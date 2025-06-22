import React, { useState, useRef, useEffect } from "react";
import "./Tweetbox.css";
import { Avatar, Button, TextField, IconButton } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import MicIcon from "@mui/icons-material/Mic"; // For Start Audio
import EmailIcon from "@mui/icons-material/Email"; // For Send OTP
import StopIcon from "@mui/icons-material/Stop"; // For Stop Recording
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";

const TweetBox = () => {
  const { user } = useUserAuth();
  const [loggedinuser] = useLoggedinuser();

  const [post, setPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const hasFetchedUserData = useRef(false);

  const email = user?.email;
  const profileImage = loggedinuser[0]?.profileImage || user?.photoURL;

  // UseEffect to fetch user data
  useEffect(() => {
    if (!user || !email || hasFetchedUserData.current) return;

    const fetchUserData = async () => {
      hasFetchedUserData.current = true;

      if (user.providerData[0]?.providerId === "password") {
        try {
          const res = await fetch(
            `http://localhost:5000/loggedinuser?email=${email}`
          );
          const data = await res.json();
          setName(data[0]?.name || "");
          setUsername(data[0]?.username || "");
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      } else {
        setName(user.displayName || "");
        setUsername(email.split("@")[0]);
      }
    };

    fetchUserData();
  }, [user, email]);

  const isValidTime = () => {
    const now = new Date();
    const hourIST = now.getUTCHours() + 5.5;
    return hourIST >= 14 && hourIST <= 19;
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleImageUpload = (e) => {
    setIsUploading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        setImageUrl(res.data.data.display_url);
        setIsUploading(false);
      })
      .catch((e) => {
        console.error("ImgBB error:", e);
        setIsUploading(false);
      });
  };

  const sendOtp = async () => {
    const res = await fetch("http://localhost:5000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success || data.message) {
      setOtpSent(true);
      alert("OTP sent to your email");
    } else {
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    const res = await fetch("http://localhost:5000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (data.success) {
      setOtpVerified(true);
      alert("OTP verified");
    } else {
      alert("Invalid OTP");
    }
  };

  const getAudioDuration = (url) =>
    new Promise((resolve) => {
      const audio = new Audio(url);
      audio.onloadedmetadata = () => resolve(audio.duration);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let audioUrl = "";
    if (audioBlob) {
      if (!otpVerified) return alert("Please verify OTP first");
      if (!isValidTime())
        return alert("Audio allowed only between 2PM–7PM IST");

      const tempUrl = URL.createObjectURL(audioBlob);
      const duration = await getAudioDuration(tempUrl);
      if (duration > 300) return alert("Audio exceeds 5 minutes");
      if (audioBlob.size > 100 * 1024 * 1024)
        return alert("Audio exceeds 100MB");

      const formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("upload_preset", "YOUR_CLOUDINARY_PRESET");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_NAME/audio/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const cloudRes = await res.json();
      audioUrl = cloudRes.secure_url;
    }

    const postObject = {
      profilephoto: profileImage,
      name,
      username,
      email,
      post,
      photo: imageUrl,
      audio: audioUrl,
    };

    await fetch("http://localhost:5000/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postObject),
    });

    // Reset
    setPost("");
    setImageUrl("");
    setAudioBlob(null);
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setLoading(false);
    alert("Tweet posted successfully!");
  };

  return (
    <div className="tweetBox">
      <form onSubmit={handleSubmit}>
        <div className="tweetBox__input">
          <Avatar src={profileImage} />
          <input
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setPost(e.target.value)}
            value={post}
          />
        </div>

        <div className="imageIcon_tweetButton">
          <label htmlFor="image" className="imageIcon">
            {isUploading ? (
              <p>Uploading...</p>
            ) : (
              <p>
                {imageUrl ? (
                  "Image Uploaded"
                ) : (
                  <AddPhotoAlternateOutlinedIcon />
                )}
              </p>
            )}
          </label>
          <input
            type="file"
            id="image"
            className="imageInput"
            onChange={handleImageUpload}
          />

          {/* Icon Buttons for Start Audio, Stop Recording, and Send OTP */}
          {!recording && (
            <IconButton
              onClick={startRecording}
              className="tweetBox__iconButton"
              title="Start Audio Recording"
            >
              <MicIcon />
            </IconButton>
          )}
          {recording && (
            <IconButton
              onClick={stopRecording}
              className="tweetBox__iconButton tweetBox__stopButton"
              title="Stop Recording"
            >
              <StopIcon />
            </IconButton>
          )}

          {audioBlob && (
            <>
              <audio controls src={URL.createObjectURL(audioBlob)} />
              {!otpSent && (
                <IconButton
                  onClick={sendOtp}
                  className="tweetBox__iconButton"
                  title="Send OTP"
                >
                  <EmailIcon />
                </IconButton>
              )}
              {otpSent && (
                <>
                  <TextField
                    size="small"
                    label="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button onClick={verifyOtp}>Verify</Button>
                </>
              )}
            </>
          )}

          <Button
            type="submit"
            className="tweetBox__tweetButton"
            disabled={loading}
          >
            Tweet
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TweetBox;
