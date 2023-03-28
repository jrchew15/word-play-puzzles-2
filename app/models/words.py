from .db import db, SCHEMA, environment

class Word(db.Model):
    __tablename__ = 'words'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100))
    length = db.Column(db.Integer)
