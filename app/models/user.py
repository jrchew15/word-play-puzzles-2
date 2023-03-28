from datetime import date
from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String(255))
    theme = db.Column(db.Enum('light','dark', name='themes'), default='light')
    created_at = db.Column(db.Date, default=date.today())

    wordgon_sessions = db.relationship("WordGonSession", back_populates="user")
    wordgons = db.relationship("WordGon", back_populates='user')
    comments = db.relationship("Comment", back_populates='user')
    wordle_sessions = db.relationship("WordleSession", back_populates="user")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self, comment=False, current=False, total=False):
        wordgon_sessions = self.wordgon_sessions
        wordle_sessions = self.wordle_sessions
        response = {
            'id': self.id,
            'username': self.username,
            'profilePicture': self.profile_picture,
            'totalWordgons': len([session for session in wordgon_sessions if session.completed]),
            'totalWordles': len([session for session in wordle_sessions if session.completed])
        }
        if comment:
            return response
        response['createdAt'] = self.created_at
        if current:
            response['email'] = self.email
            response['theme'] = self.theme
            response['openSessions'] = [ session.id for session in wordgon_sessions if not session.completed]
            response['openWordles'] = [ session.wordle.id for session in wordle_sessions if not session.completed]
        return response
