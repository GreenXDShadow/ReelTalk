const BASE_URL = '/api'; // Uses the Vite proxy

// [READ] Fetch all movies
export const getMovies = async () => {
  const response = await fetch(`${BASE_URL}/movies`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
};

// [READ+] Get all movie ids & movie titles
export const getMovieList = async () => {
  const response = await fetch(`${BASE_URL}/movies/minimal`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie list');
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

//create/read/update/delete for users

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};


export const updateUser = async (id, userData) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
};


export const deleteUser = async(id) => {
  
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();

}

//create/read/update/delete for comments

export const getComments = async () => {
  const response = await fetch(`${BASE_URL}/comments`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

export const createComment = async (commentData) => {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }

  return response.json();
};

export const updateComment = async (id, commentData) => {
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    throw new Error('Failed to update comment');
  }

  return response.json();
};

export const deleteComment = async (id) => {
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }

  return response.json();
};
