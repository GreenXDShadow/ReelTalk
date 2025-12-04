const BASE_URL = '/api'; // Uses the Vite proxy

// Auth Endpoints

export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Logout failed');
  }
  return response.json();
};

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

// [READ+] Fetch movie by id
export const getMovieById = async (id) => {
  const response = await fetch(`${BASE_URL}/movies/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch movie with id ${id}`);
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

// Get comments for specific movie
export const getCommentsByMovieId = async (movieId) => {
  const response = await fetch(`${BASE_URL}/comments/movie/${movieId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comments for movie ${movieId}`);
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

//create/read/update/delete for transactions//

export const getTransactions = async () => {
  const response = await fetch(`${BASE_URL}/transactions`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return response.json();
};

export const getTransactionById = async (id) => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch transaction with id ${id}`);
  }
  return response.json();
};

export const getTransactionsByUserId = async (userId) => {
  const response = await fetch(`${BASE_URL}/transactions/user/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions for user ${userId}`);
  }
  return response.json();
};

export const createTransaction = async (transactionData) => {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }
  return response.json();
};

export const updateTransaction = async (id, transactionData) => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    throw new Error('Failed to update transaction');
  }
  return response.json();
};

export const deleteTransaction = async (id) => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete transaction');
  }
  return response.json();
};

// --- Ratings ---

export const getMovieRating = async (movieId) => {
  const response = await fetch(`${BASE_URL}/ratings/movie/${movieId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie rating');
  }
  return response.json();
};

export const getUserRating = async (movieId, userId) => {
  const response = await fetch(`${BASE_URL}/ratings/user/${movieId}/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user rating');
  }
  return response.json();
};

export const setRating = async (ratingData) => {
  const response = await fetch(`${BASE_URL}/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ratingData),
  });
  if (!response.ok) {
    throw new Error('Failed to set rating');
  }
  return response.json();
};




// - Transaction History for a user -

export const getUserHistory = async (userId) => {
  const response = await fetch(`${BASE_URL}/users/${userId}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch user history');
  }
  return response.json();
};
