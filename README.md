# ReelTalk

This document provides instructions for setting up and running the ReelTalk project for local development. ReelTalk is an online movie rental service utilizing a React frontend and a Flask backend for people who want to make a statement. Users will be able to browse through available movies and select the movies that catch their eye. Once selected, users will be able to rent out the movies for a certain amount of time, or they can buy unlimited access. The movies will then be added to the user’s history. While the movie is rented out, the user can create comments on the movie, rate the movie, and like or dislike it, which will be shared publicly on the platform for other users to see. Once the rental time is up, the movie will be automatically returned to the platform.

## Technology Stack

  * **Frontend:** React 18, Vite
  * **Backend:** Flask, Flask-SQLAlchemy, Flask-Migrate
  * **Database:** SQLite
  * **Runtime:** Node.js (v24.11.0+), Python (v3.10.4+)

-----

## Prerequisites

Before proceeding, ensure the following software is installed on your system:

1.  **Git:** For cloning the repository.
2.  **Python (v3.10.4 or newer):** The backend runtime.
3.  **Node.js (v24.11.0 or newer):** The frontend runtime.
      * It is recommended to use **nvm (Node Version Manager)** to manage your Node.js versions.

-----

## Installation and Setup

Follow these steps to configure the local environment.

### 1\. Clone Repository

First, clone the repository to your local machine and navigate into the project directory:

```bash
git clone <your-repository-url-here>
cd ReelTalk
```

### 2\. Frontend Dependencies

Install the required Node.js packages defined in `package.json`:

```bash
npm install
```

### 3\. Backend Configuration

The backend requires a Python virtual environment and database initialization.

1.  **Create Virtual Environment**
    Navigate to the `api` directory and create a new virtual environment:

    ```bash
    cd api
    python -m venv venv
    ```

2.  **Activate Virtual Environment**
    Activate the environment to isolate project dependencies.

      * **macOS / Linux:**
        ```bash
        source venv/bin/activate
        ```
      * **Windows:**
        ```bash
        .\venv\Scripts\activate
        ```

    Your terminal prompt should indicate the active `(venv)` environment.

3.  **Install Python Dependencies**
    Return to the project's root (`ReelTalk`) directory and install all packages from `requirements.txt`:

    ```bash
    cd ..
    pip install -r requirements.txt
    ```

4.  **Initialize the Database**
    The local database is not tracked by version control and must be created manually. Flask-Migrate is used to manage the database schema.

    While the virtual environment is still active, run the following commands from the **root** directory to set the `FLASK_APP` environment variable and run the database upgrade:

      * **macOS / Linux:**
        ```bash
        export FLASK_APP=api/api.py
        flask db upgrade
        ```
      * **Windows:**
        ```bash
        set FLASK_APP=api/api.py
        flask db upgrade
        ```

    This will execute the migration scripts and generate an `app.db` file within the `api/` directory, populated with the required tables.

-----

## Running the Development Servers

This project requires two concurrent terminal processes: one for the frontend and one for the backend.

### Terminal 1: Start the Frontend (Vite)

In the root `ReelTalk` folder, run:

```bash
npm run dev
```

> This will start the React development server, typically on **`http://localhost:5173`**.

### Terminal 2: Start the Backend (Flask)

In a second terminal, from the root `ReelTalk` folder, run:

```bash
npm run api
```

> This will start the Flask development server, typically on **`http://localhost:5000`**.

-----

## Accessing the Application

Once both servers are running, the application can be accessed in your browser at `http://localhost:5173`.

The Vite server is configured to proxy all API requests (URLs prefixed with `/api`) to the Flask backend server on port 5000.