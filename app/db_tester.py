from .models import db, User, Wordle, WordleSession

def removeWordleRepeats():
    sessions = WordleSession.query.all()

    user_puzzle_pairs = set()

    for session in sessions:
        if (session.user_id, session.puzzle_id) in user_puzzle_pairs:
            print('***********************',session.to_dict())
            db.session.delete(session)
        db.session.commit()
        user_puzzle_pairs.add((session.user_id,session.puzzle_id))
