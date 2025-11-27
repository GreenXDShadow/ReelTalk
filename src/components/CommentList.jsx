import React, { useState, useEffect } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getMovieList,
  getUsers,
} from "../apiService";
import UserForm from "./UserForm";

function CommentList() {
  const [comments, setComments] = useState([]); //stores list of comments
  const [movieOptions, setMovieOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [commentText, setCommentText] = useState("");

  const [error, setError] = useState(""); //any errors go here

  useEffect(() => {
    fetchComments();
    fetchMovies();
    fetchUsers();
  }, []); //on load, fetch the comments+others

  const fetchComments = async () => {
    //we call this whenever we need to call api for getComments
    try {
      const commentsdata = await getComments(); //let api get the comments
      setComments(commentsdata); //save the response
      setError(""); //no error
    } catch (err) {
      //smth went wrong so
      setError(err.message); //save error in error
    }
  };

  const fetchMovies = async () => {
    try {
      const movies = await getMovieList();
      setMovieOptions(movies);
      setError(""); //no error
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      setUserOptions(users);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(id);
        fetchComments(); //refresh the list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMovie || !selectedUser || !commentText.trim()) {
      setError("Movie, user, and comment text are required.");
      return;
    }

    const newComment = {
      movie_id: selectedMovie,
      user_id: selectedUser,
      comment_content: commentText,
      date_created: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    try {
      await createComment(newComment);
      setCommentText("");
      setSelectedMovie("");
      setSelectedUser("");
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  function movieMapper(m) {
    return [m.id, m.title];
  }
  function userMapper(u) {
    return [u.id, u.username];
  }

  const movieMap = Object.fromEntries(movieOptions.map(movieMapper));
  const userMap = Object.fromEntries(userOptions.map(userMapper));

  return (
    //the actual component
    <div>
      <h2>All Comments</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* editing can be later */}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {comments.map((comment) => (
          <li
            key={comment.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h4>{movieMap[comment.movie_id] || "A Movie"}</h4>
            <p>{userMap[comment.user_id] || "A User"}</p>
            <p>{comment.comment_content}</p>
            <button
              onClick={() => handleDelete(comment.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

       {/* comment submitting */}
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        
        <label>
           Select Movie: 
        </label>
        <br/>
        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
        >
          <option value="">-- Select Movie --</option>
          {movieOptions.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>

        <br/>

        <label>
          Select User: 
        </label>
        <br/>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {userOptions.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>

        <br/>

        <label>
          Comment: 
        </label>
        <br/>
        <textarea
          rows="3"
          style={{ width: "300px" }}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <br/>

        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
}

export default CommentList;
