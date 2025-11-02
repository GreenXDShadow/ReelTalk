// src/components/MovieForm.jsx
import React, { useState, useEffect } from 'react';

// 'movie' prop is for editing. 'onSuccess' is a callback to refresh the list.
function MovieForm({ movie, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    rentalPrice: '',
    purchasePrice: '',
    imageLink: '',
  });

  // If a movie prop is passed, populate the form for editing
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        releaseDate: movie.release_date || '',
        rentalPrice: movie.rental_price || '',
        purchasePrice: movie.purchase_price || '',
        imageLink: movie.image_link || '',
      });
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dynamically import the correct API function
    const api = await import('../apiService');
    const apiCall = movie
      ? () => api.updateMovie(movie.id, formData)
      : () => api.createMovie(formData);

    try {
      await apiCall();
      onSuccess(); // Trigger refresh
      if (!movie) { // Clear form if it was a create operation
        setFormData({
          title: '', description: '', releaseDate: '',
          rentalPrice: '', purchasePrice: '', imageLink: '',
        });
      }
    } catch (error) {
      console.error('Failed to save movie:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>{movie ? 'Edit Movie' : 'Add New Movie'}</h3>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="imageLink"
        placeholder="Image URL"
        value={formData.imageLink}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        type="date"
        name="releaseDate"
        value={formData.releaseDate}
        onChange={handleChange}
      />
      <input
        type="number"
        name="rentalPrice"
        placeholder="Rental Price"
        value={formData.rentalPrice}
        onChange={handleChange}
        step="0.01"
      />
      <input
        type="number"
        name="purchasePrice"
        placeholder="Purchase Price"
        value={formData.purchasePrice}
        onChange={handleChange}
        step="0.01"
      />
      <button type="submit">{movie ? 'Update' : 'Create'}</button>
    </form>
  );
}

export default MovieForm;