import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // Post states
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // File upload states
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/posts", { title, content });
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/posts/${id}`);
    fetchPosts();
  };

  // Edit post
  const handleEdit = async (post) => {
    const newTitle = prompt("New Title", post.title);
    const newContent = prompt("New Content", post.content);
    if (newTitle && newContent) {
      await axios.put(`http://localhost:5000/api/posts/${post._id}`, {
        title: newTitle,
        content: newContent,
      });
      fetchPosts();
    }
  };

  // Drag & Drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Upload file
  const handleUpload = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setExtractedText(res.data.text || "No text extracted");
      if (res.data.analysis) setAnalysis(res.data.analysis);
      alert(res.data.message || "File uploaded successfully!");
    } catch (err) {
      console.log(err);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Social Media Content Analyzer</h1>

      {/* Upload Section */}
      <div
        className="upload-section"
        style={{ border: "1px solid gray", padding: "15px", width: "400px" }}
      >
        <h2>Upload PDF or Image</h2>

        {/* Drag & Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("fileInput").click()}
          style={{
            width: "100%",
            height: "150px",
            border: "2px dashed gray",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          {file ? file.name : "Drag & Drop a file here or click to select"}
        </div>

        {/* Hidden file input */}
        <input
          id="fileInput"
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />

        <button onClick={handleUpload}>
          {loading ? "Processing..." : "Upload"}
        </button>

        {/* Analysis display */}
        {analysis && (
          <div style={{ marginTop: "10px" }}>
            <h3>Analysis Result:</h3>
            <p>Word Count: {analysis.wordCount}</p>
            <p>Character Count: {analysis.charCount}</p>
            <p>Hashtag Count: {analysis.hashtagCount}</p>
            <h4>Suggestions:</h4>
            <ul>
              {analysis.suggestions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Extracted Text */}
      <h3>Extracted Text:</h3>
      <div
        className="Extracted-text"
        style={{
          border: "1px solid black",
          padding: "10px",
          minHeight: "100px",
          whiteSpace: "pre-wrap",
          marginTop: "10px",
        }}
      >
        {extractedText}
      </div>

      <hr />

      {/* Add Post Section */}
      <h2>Add Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          Add
        </button>
      </form>

      <hr />

      {/* Posts List */}
      <h2>All Posts</h2>
      {posts.map((post) => (
        <div
          className="All Posts"
          key={post._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button className="delete" onClick={() => handleDelete(post._id)}>
            Delete
          </button>
          <button
            className="edit"
            onClick={() => handleEdit(post)}
            style={{ marginLeft: "10px" }}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
