import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import "../pages.css";
const Lists = () => {
  return (
     <div className="widgets">
    <div className="widgets__input">
      <SearchIcon className="widget__searchIcon" />
      <input placeholder="Search Lists " type="text" />
    </div>
    </div>
  );
};

export default Lists;
