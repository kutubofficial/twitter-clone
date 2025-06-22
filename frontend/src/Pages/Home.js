import React from "react";
import Widgets from "./Widgets/Widgets";
import Sidebar from "./Sidebar/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
const Home = () => {
  const {logOut,user}=useUserAuth()
  const navigate = useNavigate();
  const location = useLocation()
  // const user = {
  //   displayName: "aibak",
  //   email: "aibak@gmail.com",
  // };
  const handlelogout = async () => {
    try {
      await logOut()
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };
    const isExplorePage = location.pathname.includes("explore");
  return (
    <div className={`app ${isExplorePage ? "explore-page" : ""}`}>
      <Sidebar handlelogout={handlelogout} user={user} />
      <Outlet />
      <Widgets />
    </div>
  );
};

export default Home;
