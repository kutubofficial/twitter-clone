import React, { useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { useUserAuth } from "../../context/UserAuthContext";

const Login = () => {
  const [email, seteamil] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const { googleSignIn, logIn } = useUserAuth();

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      await logIn(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.code, error.message);
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
        {error && <p className="errorMessage">{error}</p>}
        <form onSubmit={handlesubmit}>
          <input
            type="email"
            className="email"
            placeholder="Email address"
            onChange={(e) => seteamil(e.target.value)}
          />
          <input
            type="password"
            className="password"
            placeholder="Password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <div className="btn-login">
            <button type="submit" className="btn">
              Log In
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
          Don't have an account?
          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "var(--twitter-color)",
              fontWeight: "600",
              marginLeft: "5px",
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
