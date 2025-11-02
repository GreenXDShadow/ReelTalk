# api/models.py

from api import db  # Import the 'db' object from your main api.py
from datetime import datetime


# Helper method to convert model instances to dictionaries
def to_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    date_account_created = db.Column(db.DateTime, default=datetime.utcnow)
    image_link = db.Column(db.String(200), nullable=True)  # Your requested field

    # Relationships: A user can have many transactions, ratings, and comments
    transactions = db.relationship('Transaction', backref='user', lazy=True)
    ratings = db.relationship('Rating', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)

    to_dict = to_dict  # Assign helper method


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    release_date = db.Column(db.Date, nullable=True)
    description = db.Column(db.Text, nullable=True)
    rental_price = db.Column(db.Float, nullable=True)
    purchase_price = db.Column(db.Float, nullable=True)
    image_link = db.Column(db.String(200), nullable=True)  # Your requested field

    # Relationships: A movie can be in many transactions, ratings, and comments
    transactions = db.relationship('Transaction', backref='movie', lazy=True)
    ratings = db.relationship('Rating', backref='movie', lazy=True)
    comments = db.relationship('Comment', backref='movie', lazy=True)

    to_dict = to_dict  # Assign helper method


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    date_start = db.Column(db.DateTime, default=datetime.utcnow)
    transaction_type = db.Column(db.String(50), nullable=False)  # e.g., 'rent' or 'purchase'

    to_dict = to_dict  # Assign helper method


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating_score = db.Column(db.Integer, nullable=False)  # e.g., 1-5
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

    # Ensure a user can only rate a movie once
    __table_args__ = (db.UniqueConstraint('movie_id', 'user_id', name='_movie_user_uc'),)

    to_dict = to_dict  # Assign helper method


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment_content = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    to_dict = to_dict  # Assign helper method