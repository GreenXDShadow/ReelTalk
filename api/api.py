# api/api.py

import time
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Database Configuration ---
# Get the absolute path of the directory where this file is
basedir = os.path.abspath(os.path.dirname(__file__))
# Set the database URI. We are using SQLite, and the file will be app.db
# in the same directory as this script (the 'api' directory)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database and migration engine
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import models *after* 'db' is defined so models.py can use it
from models import User, Movie, Transaction, Rating, Comment


# --- API Routes ---

# API Time is from the tutorial, this will be deleted once everything is verified as working
@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


# --- Movie CRUD Endpoints ---

# [CREATE] Add a new movie
@app.route('/api/movies', methods=['POST'])
def add_movie():
    data = request.get_json()

    release_date_str = data.get('releaseDate')
    release_date_obj = None  # Default to None

    # Check if the date string is not empty
    if release_date_str:
        try:
            # Convert string (YYYY-MM-DD) to a date object
            release_date_obj = datetime.strptime(release_date_str, '%Y-%m-%d').date()
        except ValueError:
            # Handle invalid date format if necessary
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    new_movie = Movie(
        title=data['title'],
        release_date=release_date_obj,  # <-- USE THE CONVERTED OBJECT
        description=data.get('description'),
        rental_price=data.get('rentalPrice'),
        purchase_price=data.get('purchasePrice'),
        image_link=data.get('imageLink')
    )
    db.session.add(new_movie)
    db.session.commit()
    return jsonify(new_movie.to_dict()), 201  # 201 = Created


# [READ] Get all movies
@app.route('/api/movies', methods=['GET'])
def get_movies():
    movies = Movie.query.all()
    return jsonify([movie.to_dict() for movie in movies])


# [READ] Get a single movie by ID
@app.route('/api/movies/<int:id>', methods=['GET'])
def get_movie(id):
    movie = Movie.query.get_or_404(id)
    return jsonify(movie.to_dict())


# [UPDATE] Update an existing movie
@app.route('/api/movies/<int:id>', methods=['PUT'])
def update_movie(id):
    movie = Movie.query.get_or_404(id)
    data = request.get_json()

    release_date_str = data.get('releaseDate')
    if release_date_str:
        try:
            movie.release_date = datetime.strptime(release_date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    elif 'releaseDate' in data:  # Handle case where date is intentionally set to null
        movie.release_date = None

    movie.title = data.get('title', movie.title)
    movie.description = data.get('description', movie.description)
    movie.rental_price = data.get('rentalPrice', movie.rental_price)
    movie.purchase_price = data.get('purchasePrice', movie.purchase_price)
    movie.image_link = data.get('imageLink', movie.image_link)

    db.session.commit()
    return jsonify(movie.to_dict())


# [DELETE] Delete a movie
@app.route('/api/movies/<int:id>', methods=['DELETE'])
def delete_movie(id):
    movie = Movie.query.get_or_404(id)
    db.session.delete(movie)
    db.session.commit()
    return jsonify({'message': 'Movie deleted successfully'}), 200


# Note: You would continue this pattern to create CRUD endpoints for Users, Comments, Ratings, and Transactions.

# Helper
# This command is needed to run 'flask db' commands
@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Movie': Movie, 'Transaction': Transaction, 'Rating': Rating, 'Comment': Comment}