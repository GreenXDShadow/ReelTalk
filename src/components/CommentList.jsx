import React, { useState, useEffect } from "react";
import { getComments, createComment, updateComment, deleteComment } from "../apiService";
import UserForm from "./UserForm";

function CommentList() {
  const [comments, setComments] = useState([]); //stores list of comments
  const [error, setError] = useState(""); //any errors go here

  useEffect(() => {
    fetchComments();
  }, []); //on load, fetch the comments

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

  const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this comment?')) {
        try {
          await deleteComment(id);
          fetchComments(); //refresh the list
        } catch (err) {
          setError(err.message);
        }
      }
    };

  return (
    //the actual component
    <div>
      <h2>All Comments</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* editing can be later */}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {comments.map((comment) => (
          <li
            key={user.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h4>{comment.movie_id}</h4> {/* show movie name at some point */}
            <p>{comment.user_id}</p>
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
    </div>
  );
}

export default CommentList;
