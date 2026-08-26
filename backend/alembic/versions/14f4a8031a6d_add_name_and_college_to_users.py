"""add name and college to users

Revision ID: 14f4a8031a6d
Revises: 9564b3aadbe2
Create Date: 2026-08-26 20:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '14f4a8031a6d'
down_revision: Union[str, Sequence[str], None] = '9564b3aadbe2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('name', sa.String(), nullable=False, server_default=sa.text("''")))
    op.add_column('users', sa.Column('college', sa.String(), nullable=False, server_default=sa.text("''")))
    op.execute("ALTER TABLE users ALTER COLUMN name DROP DEFAULT")
    op.execute("ALTER TABLE users ALTER COLUMN college DROP DEFAULT")


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'college')
    op.drop_column('users', 'name')
