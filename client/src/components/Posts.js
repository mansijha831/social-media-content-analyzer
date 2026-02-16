import React, { useEffect, useState } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      {posts.map((post) => (
        <div
          key={post._id}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Posts;
