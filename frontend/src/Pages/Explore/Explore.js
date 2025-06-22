import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "../pages.css";
import "./explore.css"

const Explore = () => {
  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon className="widget__searchIcon" />
        <input placeholder="Search " type="text" />
      </div>
      
      <div className="widgets__widgetContainer">
        <h2>Trends for you</h2>
        
        <div className="widgets__trendItem">
          <div className="widgets__trendCategory">
            Trending in India
            <MoreHorizIcon fontSize="small" />
          </div>
          <div className="widgets__trendName">#TelAviv</div>
          <div className="widgets__trendPosts">166K posts</div>
        </div>
        
        <div className="widgets__trendItem">
          <div className="widgets__trendCategory">
            Sports · Trending
            <MoreHorizIcon fontSize="small" />
          </div>
          <div className="widgets__trendName">#WtcFinal2025</div>
          <div className="widgets__trendPosts">2,609 posts</div>
        </div>
        
        <div className="widgets__trendItem">
          <div className="widgets__trendCategory">
            Sports · Trending
            <MoreHorizIcon fontSize="small" />
          </div>
          <div className="widgets__trendName">Netherlands</div>
          <div className="widgets__trendPosts">53.5K posts</div>
        </div>
        
        <div className="widgets__trendItem">
          <div className="widgets__trendCategory">
            Business & finance · Trending
            <MoreHorizIcon fontSize="small" />
          </div>
          <div className="widgets__trendName">#StockMarketIndia</div>
          <div className="widgets__trendPosts">1,917 posts</div>
        </div>
        
        <div className="widgets__trendItem">
          <div className="widgets__trendCategory">
            Trending in India
            <MoreHorizIcon fontSize="small" />
          </div>
          <div className="widgets__trendName">3rd Super Over</div>
          <div className="widgets__trendPosts">Trending with #INDvsPAK</div>
        </div>
        
        <div className="widgets__showMore">
          Show more
        </div>
      </div>
    </div>
  );
};

export default Explore;