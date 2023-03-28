from flask.cli import AppGroup
from .users import seed_users, undo_users
from .words import seed_words, undo_words
from .wordgons import seed_wordgons, undo_wordgons, puzzles_of_the_day
from .comments import seed_comments, undo_comments
from .wordles import seed_wordles, undo_wordles
from ..models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding, truncate all tables prefixed with schema name
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.words RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.word_gons RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.wordles RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.word_gons_sessions RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.wordle_sessions RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
        # Add a truncate command here for every table that will be seeded.
        db.session.commit()
    seed_users()
    seed_words()
    seed_wordgons()
    puzzles_of_the_day()
    seed_comments()
    seed_wordles()
    # Add other seed functions here

@seed_commands.command('wordles_only')
def seed_wordles_only():
    seed_wordles()

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_words()
    undo_wordgons()
    undo_comments()
    undo_wordles()
    # Add other undo functions here

@seed_commands.command('undo_wordles_only')
def undo_wordles_only():
    undo_wordles()
