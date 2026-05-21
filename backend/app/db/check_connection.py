from sqlalchemy import text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import OperationalError

from app.core.config import BACKEND_DIR, settings
from app.db.session import engine


def masked_database_url() -> str:
    url = make_url(settings.sqlalchemy_database_url)
    if url.password:
        url = url.set(password="***")
    return str(url)


def main() -> None:
    print(f"Loaded env file: {BACKEND_DIR / '.env'}")
    print(f"Checking database: {masked_database_url()}")
    try:
        with engine.connect() as connection:
            database = connection.execute(text("select current_database()")).scalar_one()
            user = connection.execute(text("select current_user")).scalar_one()
        print(f"Database connection OK. database={database} user={user}")
    except OperationalError as exc:
        print("Database connection failed.")
        detail = str(exc.orig)
        if "does not exist" in detail:
            print("PostgreSQL accepted the password, but the target database does not exist yet.")
            print("Fix: run `python -m app.db.create_database` from the backend folder.")
        else:
            print("PostgreSQL is reachable, but it rejected the username/password in DATABASE_URL.")
            print("Fix: reset the postgres user password in pgAdmin, then put that exact password in backend/.env.")
        print(f"Details: {exc.orig}")
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
