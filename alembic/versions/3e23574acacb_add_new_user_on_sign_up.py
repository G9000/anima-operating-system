"""add_new_user_on_sign_up

Revision ID: 3e23574acacb
Revises: 0b80fd1b2050
Create Date: 2025-05-23 15:00:41.212233

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3e23574acacb'
down_revision: Union[str, None] = '0b80fd1b2050'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Create the trigger function
    op.execute("""
    CREATE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    BEGIN
        INSERT INTO public.users (id, email)
        VALUES (
            NEW.id,
            NEW.email
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email;
        RETURN NEW;
    END;
    $$;
    """)

    # Create the first trigger
    op.execute("""
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE PROCEDURE public.handle_new_user();
    """)

    # Create the second trigger
    op.execute("""
    CREATE TRIGGER on_auth_user_verified
        AFTER UPDATE ON auth.users
        FOR EACH ROW
        WHEN (
            OLD.last_sign_in_at IS NULL
            AND NEW.last_sign_in_at IS NOT NULL
        )
        EXECUTE PROCEDURE public.handle_new_user();
    """)


def downgrade():
    # Drop the triggers
    op.execute("""
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    """)
    op.execute("""
    DROP TRIGGER IF EXISTS on_auth_user_verified ON auth.users;
    """)

    # Drop the trigger function
    op.execute("""
    DROP FUNCTION IF EXISTS public.handle_new_user();
    """)