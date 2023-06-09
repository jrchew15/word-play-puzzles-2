"""empty message

Revision ID: 4b733f9289e9
Revises:
Create Date: 2023-03-28 13:19:26.041859

"""
from alembic import op
import sqlalchemy as sa
import os
environment = os.getenv('FLASK_ENV')
SCHEMA = os.environ.get('SCHEMA')

# revision identifiers, used by Alembic.
revision = '4b733f9289e9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('profile_picture', sa.String(length=255), nullable=True),
    sa.Column('theme', sa.Enum('light', 'dark', name='themes'), nullable=True),
    sa.Column('created_at', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    if environment == 'production':
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
    op.create_table('wordles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('word', sa.String(length=5), nullable=False),
    sa.Column('puzzle_day', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('word')
    )
    if environment == 'production':
        op.execute(f"ALTER TABLE wordles SET SCHEMA {SCHEMA};")
    op.create_table('words',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('word', sa.String(length=100), nullable=True),
    sa.Column('length', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == 'production':
        op.execute(f"ALTER TABLE words SET SCHEMA {SCHEMA};")
    op.create_table('word_gons',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('letters', sa.String(length=25), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('shape', sa.Enum('square', 'trapezoid', 'pentagon', name='shapes'), nullable=False),
    sa.Column('num_attempts', sa.Integer(), nullable=True),
    sa.Column('puzzle_day', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('letters')
    )
    if environment == 'production':
        op.execute(f"ALTER TABLE word_gons SET SCHEMA {SCHEMA};")
    op.create_table('wordle_sessions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('puzzle_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('guesses', sa.String(length=35), nullable=True),
    sa.Column('num_guesses', sa.Integer(), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.Date(), nullable=True),
    sa.Column('updated_at', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['puzzle_id'], ['wordles.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == 'production':
        op.execute(f"ALTER TABLE wordle_sessions SET SCHEMA {SCHEMA};")
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('puzzle_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('body', sa.String(length=255), nullable=False),
    sa.Column('reply_to', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.Date(), nullable=True),
    sa.Column('updated_at', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['puzzle_id'], ['word_gons.id'], ),
    sa.ForeignKeyConstraint(['reply_to'], ['comments.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == 'production':
        op.execute(f"ALTER TABLE comments SET SCHEMA {SCHEMA};")
    op.create_table('word_gons_sessions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('puzzle_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('guesses', sa.String(length=255), nullable=True),
    sa.Column('num_guesses', sa.Integer(), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.Date(), nullable=True),
    sa.Column('updated_at', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['puzzle_id'], ['word_gons.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == 'production':
        op.execute(f"ALTER TABLE word_gons_sessions SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('word_gons_sessions')
    op.drop_table('comments')
    op.drop_table('wordle_sessions')
    op.drop_table('word_gons')
    op.drop_table('words')
    op.drop_table('wordles')
    op.drop_table('users')
    # ### end Alembic commands ###
