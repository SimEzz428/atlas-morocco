from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0002_fx_rates"
down_revision = "0001_init"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        "fx_rates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("base", sa.String(length=8), nullable=False),
        sa.Column("quote", sa.String(length=8), nullable=False),
        sa.Column("rate", sa.Float(), nullable=False),
        sa.Column("provider", sa.String(length=64), nullable=True),
        sa.Column("captured_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
    )
    op.create_index("ix_fx_rates_pair_time", "fx_rates", ["base", "quote", "captured_at"])

def downgrade() -> None:
    op.drop_index("ix_fx_rates_pair_time", table_name="fx_rates")
    op.drop_table("fx_rates")