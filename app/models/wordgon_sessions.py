from datetime import datetime
from .db import db


class WordGonSession(db.Model):
    __tablename__ = 'word_gons_sessions'

    id = db.Column(db.Integer, primary_key=True)
    puzzle_id = db.Column(db.Integer, db.ForeignKey('word_gons.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    guesses = db.Column(db.String(255), default='')
    num_guesses = db.Column(db.Integer, default=0)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.Date, default=datetime.now())
    updated_at = db.Column(db.Date, default=datetime.now(), onupdate=datetime.now())

    user = db.relationship("User", back_populates="wordgon_sessions")
    wordgon = db.relationship("WordGon", back_populates="sessions")

    def to_dict(self):
        return {
            'id': self.id,
            "puzzleId": self.puzzle_id,
            'userId': self.user_id,
            'guesses': self.guesses,
            'numGuesses': self.num_guesses,
            'completed': self.completed,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
