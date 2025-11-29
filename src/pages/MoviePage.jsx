import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMovieById,
  getCommentsByMovieId,
  createComment,
  deleteComment,
  updateComment,
  getMovieRating,
  getUserRating,
  setRating
} from "../apiService";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/Navbar";
import TransactionAddButton from "../components/TransactionAddButton";
import TransactionDeleteButton from "../components/TransactionDeleteButton";
import "../css/MoviePage.css";

export default function MoviePage() {
  const { id } = useParams();
  const { user } = useAuth(); // Get current logged-in user

  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [error, setError] = useState("");

  // Rating State
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    fetchMovie();
    fetchComments();
    fetchRatings();
  }, [id]);

  // Fetch user specific rating when user changes or loads
  useEffect(() => {
    if (user && user.id) {
      fetchUserRating();
    } else {
      setUserRating(0); // Reset if logged out
    }
  }, [user, id]);

  const fetchMovie = async () => {
    try {
      const data = await getMovieById(id);
      setMovie(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByMovieId(id);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const fetchRatings = async () => {
    try {
      const data = await getMovieRating(id);
      setAvgRating(data.average);
      setRatingCount(data.count);
    } catch (err) {
      console.error("Failed to fetch ratings", err);
    }
  };

  const fetchUserRating = async () => {
    try {
      const data = await getUserRating(id, user.id);
      setUserRating(data.rating);
    } catch (err) {
      console.error("Failed to fetch user rating", err);
    }
  };

  // --- Rating Handlers ---
  const handleRate = async (score) => {
    if (!user) return; // Should be handled by UI visibility, but safety check

    try {
      await setRating({
        movie_id: id,
        user_id: user.id,
        rating_score: score
      });

      // Refresh data
      fetchUserRating();
      fetchRatings();
    } catch (err) {
      alert("Failed to submit rating: " + err.message);
    }
  };

  // --- Comment Handlers ---

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const commentData = {
        movie_id: id,
        user_id: user.id,
        comment_content: newCommentText,
        date_created: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
      await createComment(commentData);
      setNewCommentText(""); // Clear input
      fetchComments(); // Refresh list
    } catch (err) {
      alert("Error adding comment: " + err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId);
        fetchComments();
      } catch (err) {
        alert("Error deleting comment: " + err.message);
      }
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.comment_content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await updateComment(commentId, { comment_content: editingText });
      setEditingCommentId(null);
      fetchComments();
    } catch (err) {
      alert("Error updating comment: " + err.message);
    }
  };

  // Helper component for Stars
  const StarDisplay = ({ rating, interactive = false, onRate }) => {
    return (
      <div className="star-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""} ${interactive ? "interactive" : ""}`}
            onClick={() => interactive && onRate(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movieContainer">
      <NavBar />

      <div className="movieContent">
        {/* Left: Image */}
        <div className="movieDiv" style={{ flex: "0 0 300px" }}>
          <img
            src={movie.image_link || "https://via.placeholder.com/300x450"}
            alt={movie.title}
            style={{ width: "100%", borderRadius: "5px", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }}
          />
        </div>

        {/* Right: Info */}
        <div className="movieDiv" style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>{movie.title}</h1>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.6", marginBottom: "20px" }}>
            {movie.description}
          </p>
          <p><strong>Released:</strong> {movie.release_date}</p>

          {/* --- Rating Section --- */}
          <div className="rating-section">
            <div className="rating-display">
              <strong>Average Rating:</strong>
              <StarDisplay rating={Math.round(avgRating)} />
              <span>({avgRating} / 5 based on {ratingCount} votes)</span>
            </div>

            {user && (
              <div className="user-rating-control">
                <span>Your Rating:</span>
                <StarDisplay rating={userRating} interactive={true} onRate={handleRate} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <TransactionAddButton movieId={movie.id} transactionType="rent"/>
            <TransactionAddButton movieId={movie.id} transactionType="buy"/>
            <TransactionDeleteButton movieId={movie.id}/>
          </div>
        </div>
      </div>

      {/* --- Comments Section --- */}
      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>

        {/* Add Comment Form - Only for logged in users */}
        {user ? (
          <form onSubmit={handleAddComment} className="add-comment-form">
            <textarea
              rows="3"
              placeholder="Share your thoughts on this movie..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              required
            />
            <button type="submit" style={{ width: "fit-content" }}>Post Comment</button>
          </form>
        ) : (
          <p style={{ fontStyle: "italic", color: "#888", marginBottom: "20px" }}>
            Please <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => document.getElementById("root").scrollIntoView()}>log in</span> to leave a comment.
          </p>
        )}

        {/* List of Comments */}
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <img
              src={comment.user_image || "https://via.placeholder.com/50"}
              alt="avatar"
              className="user-avatar"
            />
            <div className="comment-body">
              <div className="comment-header">
                <span className="comment-author">{comment.username || "Unknown User"}</span>
                <span>{comment.date_created}</span>
              </div>

              {/* Edit Mode vs View Mode */}
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    className="edit-textarea"
                    rows="3"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <div className="comment-actions">
                    <button onClick={() => handleUpdateComment(comment.id)} style={{ backgroundColor: "#4CAF50", color: "white" }}>Save</button>
                    <button onClick={cancelEditing} style={{ backgroundColor: "#f44336", color: "white" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="comment-text">{comment.comment_content}</p>

                  {/* Edit/Delete Buttons (Only if user owns the comment) */}
                  {user && user.id === comment.user_id && (
                    <div className="comment-actions">
                      <button onClick={() => startEditing(comment)}>Edit</button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ backgroundColor: "#d9534f", color: "white", borderColor: "#d43f3a" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p style={{ color: "#777", textAlign: "center" }}>No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}