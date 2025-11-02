const BASE_URL = '/api'; // Uses the Vite proxy

// [READ] Fetch all movies
export const getMovies = async () => {
  const response = await fetch(`${BASE_URL}/movies`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
};

// [CREATE] Add a new movie
export const createMovie = async (movieData) => {
  const response = await fetch(`${BASE_URL}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movieData),
  });
  if (!response.ok) {
    throw new Error('Failed to create movie');
  }
  return response.json();
};

// [UPDATE] Update an existing movie
export const updateMovie = async (id, movieData) => {
  const response = await fetch(`${BASE_URL}/movies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movieData),
  });
  if (!response.ok) {
    throw new Error('Failed to update movie');
  }
  return response.json();
};

// [DELETE] Delete a movie
export const deleteMovie = async (id) => {
  const response = await fetch(`${BASE_URL}/movies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete movie');
  }
  return response.json();
};