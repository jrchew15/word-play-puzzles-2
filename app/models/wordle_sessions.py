from datetime import datetime
from .db import db


class WordleSession(db.Model):
    __tablename__ = 'wordle_sessions'

    id = db.Column(db.Integer, primary_key=True)
    puzzle_id = db.Column(db.Integer, db.ForeignKey('wordles.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    guesses = db.Column(db.String(35), default='')
    num_guesses = db.Column(db.Integer, default=0)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.Date, default=datetime.now())
    updated_at = db.Column(db.Date, default=datetime.now(), onupdate=datetime.now())

    user = db.relationship("User", back_populates="wordle_sessions")
    wordle = db.relationship("Wordle", back_populates="sessions")

    def to_dict(self):
        return {
            'id': self.id,
            "puzzleId": self.puzzle_id,
            'userId': self.user_id,
            'guesses': self.guesses,
            'numGuesses': self.num_guesses,
            'completed': self.completed,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
