import React, { useEffect, useState } from "react";
import "./Feed.css";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";
import { BASE_URL } from "../../config/api";

const Feed = () => {
  const [post, setpost] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/post`)
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
      });
  }, []); 

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <Tweetbox />
      {post?.map((p) => (
        <Posts key={p._id} p={p} />
      ))}
    </div>
  );
};

export default Feed;
