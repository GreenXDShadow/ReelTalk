# api/api.py

from functools import wraps
import time
import click
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import login_user, logout_user, login_required, current_user
from datetime import datetime
from extensions import db, bcrypt, login_manager
from models import User, Movie, Transaction, Rating, Comment
import os


# Helper: Check if user has a transaction for a movie
def user_has_transaction(user_id, movie_id):
    'Returns True if the user has rented or purchased the movie.'
    return Transaction.query.filter_by(
        user_id=user_id,
        movie_id=movie_id
    ).first() is not None


# Simple Admin Check Functions
def is_admin():
    # Must be logged in AND have is_admin = True
    return current_user.is_authenticated and getattr(current_user, 'is_admin', False)


def admin_only():
    return jsonify({'error': 'Admin access required'}), 403


app = Flask(__name__)
# IMPORTANT: Set a secret key for session management!
# IN prod you'd NEVER do this but for the sake of the assignment and me being lazy ill leave it here
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'

# Database Config
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

# Initialize Extensions
db.init_app(app)
bcrypt.init_app(app)
login_manager.init_app(app)
migrate = Migrate(app, db)


# --- CLI COMMANDS (Administrative Way to Create/Delete Users) ---

@app.cli.command('create-user')
@click.argument('username')
@click.argument('password')
def create_user(username, password):
    """Create a new user: flask create-user <username> <password>"""
    if User.query.filter_by(username=username).first():
        print(f"Error: User '{username}' already exists.")
        return

    # The model's @password.setter handles the hashing automatically!
    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()
    print(f"User '{username}' created successfully.")


@app.cli.command('delete-user')
@click.argument('username')
def delete_user(username):
    'Delete a user: flask delete-user <username>'
    user = User.query.filter_by(username=username).first()
    if not user:
        print(f"Error: User '{username}' not found.")
        return

    db.session.delete(user)
    db.session.commit()
    print(f"User '{username}' deleted.")


# --- Auth Routes ---

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.verify_password(password):
        login_user(user)
        return jsonify({'message': 'Logged in successfully', 'user': user.to_dict()}), 200

    return jsonify({'error': 'Invalid username or password'}), 401


@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


# --- API Routes ---

# API Time is from the tutorial, this will be deleted once everything is verified as working
@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


# --- Movie CRUD Endpoints ---

# [CREATE] Add a new movie
@app.route('/api/movies', methods=['POST'])
def add_movie():
    if not is_admin():
        return admin_only()

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
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

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
    results = []

    for movie in movies:
        data = movie.to_dict()

        # Calculate Average Rating
        ratings = movie.ratings
        if ratings:
            avg = sum(r.rating_score for r in ratings) / len(ratings)
            data['average_rating'] = round(avg, 1)
        else:
            data['average_rating'] = 0

        # Comment count
        data['comment_count'] = len(movie.comments)

        # short preview of the most recent 2 comments
        sorted_comments = sorted(movie.comments, key=lambda c: c.date_created, reverse=True)[:2]
        data['comment_preview'] = [
            {
                'username': c.user.username if c.user else None,
                'comment_content': c.comment_content,
                'date_created': c.date_created.isoformat() if c.date_created else None,
            }
            for c in sorted_comments
        ]

        results.append(data)

    return jsonify(results)


# [READ] Get a single movie by ID
@app.route('/api/movies/<int:id>', methods=['GET'])
def get_movie(id):
    movie = Movie.query.get_or_404(id)
    return jsonify(movie.to_dict())


# [READ] Select movie IDs and titles
@app.route('/api/movies/minimal', methods=['GET'])
def get_movie_minimal():
    movies = Movie.query.with_entities(Movie.id, Movie.title).all()
    movie_list = [{'id': m.id, 'title': m.title} for m in movies]
    return jsonify(movie_list)


# [UPDATE] Update an existing movie
@app.route('/api/movies/<int:id>', methods=['PUT'])
def update_movie(id):
    if not is_admin():
        return admin_only()

    movie = Movie.query.get_or_404(id)
    data = request.get_json()

    release_date_str = data.get('releaseDate')
    if release_date_str:
        try:
            movie.release_date = datetime.strptime(release_date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
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
    if not is_admin():
        return admin_only()

    movie = Movie.query.get_or_404(id)
    db.session.delete(movie)
    db.session.commit()
    return jsonify({'message': 'Movie deleted successfully'}), 200


# --- User CRUD Endpoints ---

# [CREATE] Add a new user (Public Signup)
@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    if not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password required'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400

    new_user = User(
        username=data['username'],
        password=data['password'],  # This triggers the hashing
        image_link=data.get('image_link'),
        date_account_created=datetime.utcnow()
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201


# [READ] Get all users (Admin only)
@app.route('/api/users', methods=['GET'])
def get_users():
    if not is_admin():
        return admin_only()

    users = User.query.all()
    return jsonify([user.to_dict() for user in users])


# [UPDATE] Update an existing user (Admin only)
@app.route('/api/users/<int:id>', methods=['PUT'])
def update_user(id):
    if not is_admin():
        return admin_only()

    user = User.query.get_or_404(id)
    data = request.get_json()

    if 'username' in data:
        user.username = data['username']
    if 'image_link' in data:
        user.image_link = data['image_link']
    if 'date_account_created' in data:
        try:
            user.date_account_created = datetime.strptime(data['date_account_created'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    db.session.commit()
    return jsonify(user.to_dict())


# [DELETE] Delete a user (Admin only)
@app.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    if not is_admin():
        return admin_only()

    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200


# --- Comment CRUD Endpoints ---

# [CREATE] Add a new comment
@app.route('/api/comments', methods=['POST'])
def add_comment():
    data = request.get_json()

    movie_id = data.get('movie_id')
    user_id = data.get('user_id')
    content = data.get('comment_content')

    if not movie_id or not user_id or not content:
        return jsonify({'error': 'movie_id, user_id, & comment_content are required'}), 400

    # User must have watched (rented or purchased) the movie
    if not user_has_transaction(user_id, movie_id):
        return jsonify({'error': 'User has not rented or purchased this movie'}), 403

    new_comment = Comment(
        movie_id=movie_id,
        user_id=user_id,
        comment_content=content,
        date_created=datetime.strptime(
            data['date_created'],
            '%Y-%m-%d %H:%M:%S'
        ) if data.get('date_created') else datetime.utcnow()
    )    db.session.commit()
    return jsonify(new_comment.to_dict()), 201


# [READ] Get all comments
@app.route('/api/comments', methods=['GET'])
def get_comments():
    comments = Comment.query.all()
    return jsonify([comment.to_dict() for comment in comments])


# [READ] Get comments for a specific movie
@app.route('/api/comments/movie/<int:movie_id>', methods=['GET'])
def get_comments_by_movie(movie_id):
    comments = Comment.query.filter_by(movie_id=movie_id).order_by(Comment.date_created.desc()).all()
    results = []
    for comment in comments:
        data = comment.to_dict()
        # Manually attach user info from the relationship
        if comment.user:
            data['username'] = comment.user.username
            data['user_image'] = comment.user.image_link
        results.append(data)
    return jsonify(results)


# [READ] Get a single comment by ID
@app.route('/api/comments/<int:id>', methods=['GET'])
def get_comment(id):
    comment = Comment.query.get_or_404(id)
    return jsonify(comment.to_dict())


# [UPDATE] Update an existing comment
@app.route('/api/comments/<int:id>', methods=['PUT'])
def update_comment(id):
    comment = Comment.query.get_or_404(id)
    data = request.get_json()

    if 'movie_id' in data:
        comment.movie_id = data['movie_id']
    if 'user_id' in data:
        comment.user_id = data['user_id']
    if 'comment_content' in data:
        comment.comment_content = data['comment_content']
    if 'date_created' in data:
        try:
            comment.date_created = datetime.strptime(data['date_created'], '%Y-%m-%d %H:%M:%S')
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD HH:MM:SS'}), 400

    db.session.commit()
    return jsonify(comment.to_dict())


# [DELETE] Delete a comment
@app.route('/api/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    comment = Comment.query.get_or_404(id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Comment deleted successfully'}), 200


# --- Transaction CRUD Endpoints ---

# [CREATE] Add a new transaction
@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()

    if not data.get('movie_id') or not data.get('user_id') or not data.get('transaction_type'):
        return jsonify({'error': 'movie_id, user_id, & transaction_type are required'}), 400

    new_transaction = Transaction(
        movie_id=data['movie_id'],
        user_id=data['user_id'],
        date_start=datetime.strptime(
            data['date_start'],
            '%Y-%m-%d %H:%M:%S'
        ) if data.get('date_start') else datetime.utcnow(),
        transaction_type=data['transaction_type']
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify(new_transaction.to_dict()), 201


# [READ] Get all transactions
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([transaction.to_dict() for transaction in transactions])


# [READ] Get a single transaction by ID
@app.route('/api/transactions/<int:id>', methods=['GET'])
def get_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    return jsonify(transaction.to_dict())


# [READ] Get richer order history for a user (with movie info)
@app.route('/api/users/<int:user_id>/history', methods=['GET'])
def get_user_history(user_id):
    """Returns a richer order history for a user, including movie title & image."""
    results = (
        db.session.query(Transaction, Movie)
        .join(Movie, Transaction.movie_id == Movie.id)
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.date_start.desc())
        .all()
    )

    history = []
    for transaction, movie in results:
        history.append({
            'transaction_id': transaction.id,
            'movie_id': movie.id,
            'movie_title': movie.title,
            'movie_image': movie.image_link,
            'date_start': transaction.date_start.isoformat() if transaction.date_start else None,
            'transaction_type': transaction.transaction_type,
        })

    return jsonify(history), 200


# [UPDATE] Update an existing transaction
@app.route('/api/transactions/<int:id>', methods=['PUT'])
def update_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    data = request.get_json()

    if 'movie_id' in data:
        transaction.movie_id = data['movie_id']
    if 'user_id' in data:
        transaction.user_id = data['user_id']
    if 'date_start' in data:
        try:
            transaction.date_start = datetime.strptime(data['date_start'], '%Y-%m-%d %H:%M:%S')
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD HH:MM:SS'}), 400
    if 'transaction_type' in data:
        transaction.transaction_type = data['transaction_type']

    db.session.commit()
    return jsonify(transaction.to_dict())


# [DELETE] Delete a transaction
@app.route('/api/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted successfully'}), 200


# --- Rating CRUD Endpoints ---

# [GET] Get average rating for a movie
@app.route('/api/ratings/movie/<int:movie_id>', methods=['GET'])
def get_movie_rating(movie_id):
    ratings = Rating.query.filter_by(movie_id=movie_id).all()
    if not ratings:
        return jsonify({'average': 0, 'count': 0})

    avg = sum(r.rating_score for r in ratings) / len(ratings)
    return jsonify({'average': round(avg, 1), 'count': len(ratings)})


# [GET] Get a specific user's rating for a movie
@app.route('/api/ratings/user/<int:movie_id>/<int:user_id>', methods=['GET'])
def get_user_rating(movie_id, user_id):
    rating = Rating.query.filter_by(movie_id=movie_id, user_id=user_id).first()
    if rating:
        return jsonify({'rating': rating.rating_score})
    return jsonify({'rating': 0})


# [POST] Create or Update a rating
@app.route('/api/ratings', methods=['POST'])
def set_rating():
    data = request.get_json()

    movie_id = data.get('movie_id')
    user_id = data.get('user_id')
    score = data.get('rating_score')

    if movie_id is None or user_id is None or score is None:
        return jsonify({'error': 'movie_id, user_id, and rating_score are required'}), 400

    # User must have watched movie
    if not user_has_transaction(user_id, movie_id):
        return jsonify({'error': 'User has not rented or purchased this movie'}), 403

    # Upsert: update or create rating
    rating = Rating.query.filter_by(movie_id=movie_id, user_id=user_id).first()

    if rating:
        rating.rating_score = score
        rating.date_posted = datetime.utcnow()
    else:
        rating = Rating(movie_id=movie_id, user_id=user_id, rating_score=score)
        db.session.add(rating)

    db.session.commit()
    return jsonify(rating.to_dict()), 201


# Helper
# This command is needed to run 'flask db' commands
@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Movie': Movie,
        'Transaction': Transaction,
        'Rating': Rating,
        'Comment': Comment
    }
