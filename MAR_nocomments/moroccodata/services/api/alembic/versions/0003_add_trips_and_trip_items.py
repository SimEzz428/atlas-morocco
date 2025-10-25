"""add_trips_and_trip_items

Revision ID: 0003_add_trips_and_trip_items
Revises: 0002_fx_rates
Create Date: 2025-01-24 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0003_add_trips_and_trip_items'
down_revision = '0002_fx_rates'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create trips table
    op.create_table('trips',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('slug', sa.String(64), nullable=False),
        sa.Column('title', sa.String(128), nullable=False),
        sa.Column('user_id', sa.String(64), nullable=True),
        sa.Column('session_id', sa.String(64), nullable=True),
        sa.Column('city_slug', sa.String(64), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_trip_user_id', 'trips', ['user_id'], unique=False)
    op.create_index('idx_trip_session_id', 'trips', ['session_id'], unique=False)
    op.create_index('idx_trip_city_slug', 'trips', ['city_slug'], unique=False)
    op.create_index(op.f('ix_trips_slug'), 'trips', ['slug'], unique=True)

    # Create trip_items table
    op.create_table('trip_items',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('trip_id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(160), nullable=False),
        sa.Column('category', sa.String(64), nullable=False),
        sa.Column('lat', sa.Float(), nullable=False),
        sa.Column('lon', sa.Float(), nullable=False),
        sa.Column('day_index', sa.Integer(), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False),
        sa.Column('place_id', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_trip_item_order', 'trip_items', ['trip_id', 'day_index', 'order_index'], unique=False)
    op.create_index(op.f('ix_trip_items_category'), 'trip_items', ['category'], unique=False)
    op.create_index(op.f('ix_trip_items_name'), 'trip_items', ['name'], unique=False)
    op.create_index(op.f('ix_trip_items_trip_id'), 'trip_items', ['trip_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_trip_items_trip_id'), table_name='trip_items')
    op.drop_index(op.f('ix_trip_items_name'), table_name='trip_items')
    op.drop_index(op.f('ix_trip_items_category'), table_name='trip_items')
    op.drop_index('idx_trip_item_order', table_name='trip_items')
    op.drop_table('trip_items')
    op.drop_index(op.f('ix_trips_slug'), table_name='trips')
    op.drop_index('idx_trip_city_slug', table_name='trips')
    op.drop_index('idx_trip_session_id', table_name='trips')
    op.drop_index('idx_trip_user_id', table_name='trips')
    op.drop_table('trips')
