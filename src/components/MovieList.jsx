// src/components/MovieList.jsx
import React, { useState, useEffect } from 'react';
import { getMovies, deleteMovie } from '../apiService';
import MovieForm from './MovieForm';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null); // State to hold movie being edited
  const [error, setError] = useState('');

  // Initial data fetch
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        fetchMovies(); // Refresh the list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
  };

  const handleFormSuccess = () => {
    setEditingMovie(null); // Clear editing state
    fetchMovies(); // Refresh the list
  };

  return (
    <div>
      <h2>Movie Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form for Creating or Editing */}
      <MovieForm
        key={editingMovie ? editingMovie.id : 'new'} // Re-mounts form when editingMovie changes
        movie={editingMovie}
        onSuccess={handleFormSuccess}
      />

      <h3>Available Movies</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {movies.map((movie) => (
          <li key={movie.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <img src={movie.image_link || 'https://via.placeholder.com/100x150'} alt={movie.title} style={{width: '100px', float: 'left', marginRight: '10px'}} />
            <h4>{movie.title}</h4>
            <p>{movie.description}</p>
            <p><strong>Rent:</strong> ${movie.rental_price} | <strong>Buy:</strong> ${movie.purchase_price}</p>
            <button onClick={() => handleEdit(movie)}>Edit</button>
            <button onClick={() => handleDelete(movie.id)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;