import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import "./login.css";

const Signup = () => {
  const [username, setusername] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [error, seterror] = useState("");
  const [password, setpassword] = useState("");
  const { signUp, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      await signUp(email, password);
      const user = { username, name, email, password };
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.acknowledged) {
        navigate("/");
      }
    } catch (error) {
      seterror(error.message);
      window.alert(error.message);
    }
  };

  const hanglegooglesignin = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <TwitterIcon style={{ color: "skyblue" }} />
        <h2 className="heading">Happening now</h2>
        <h3 className="heading1">Join Twiller today</h3>
        {error && <p className="errorMessage">{error}</p>}
        <form onSubmit={handlesubmit}>
          <input
            type="text"
            className="display-name"
            placeholder="@username"
            onChange={(e) => setusername(e.target.value)}
          />
          <input
            type="text"
            className="display-name"
            placeholder="Enter Full Name"
            onChange={(e) => setname(e.target.value)}
          />
          <input
            type="email"
            className="email"
            placeholder="Email Address"
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            type="password"
            className="password"
            placeholder="Password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <div className="btn-login">
            <button type="submit" className="btn">
              Sign Up
            </button>
          </div>
        </form>
        <hr />
        <GoogleButton
          className="g-btn"
          type="light"
          onClick={hanglegooglesignin}
        />
        <div>
          Already have an account?
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "var(--twitter-color)",
              fontWeight: "600",
              marginLeft: "5px",
            }}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
