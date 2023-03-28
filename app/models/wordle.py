from .db import db, SCHEMA, environment


class Wordle(db.Model):
    __tablename__ = 'wordles'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(5), nullable=False, unique=True)
    puzzle_day = db.Column(db.Date, default=None)

    sessions = db.relationship("WordleSession", back_populates="wordle")

    def to_dict(self):
        return {
            "id": self.id,
            "word": self.word,
            "puzzleDay": str(self.puzzle_day),
        }
