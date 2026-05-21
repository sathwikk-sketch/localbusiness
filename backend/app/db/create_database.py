from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL, make_url
from sqlalchemy.exc import OperationalError

from app.core.config import settings


def admin_url() -> URL:
    url = make_url(settings.sqlalchemy_database_url)
    return url.set(database="postgres")


def main() -> None:
    target_database = settings.DB_NAME or make_url(settings.sqlalchemy_database_url).database or "localbiz"
    url = admin_url()
    masked = url.set(password="***") if url.password else url
    print(f"Connecting through: {masked}")
    print(f"Creating database if missing: {target_database}")

    engine = create_engine(url, isolation_level="AUTOCOMMIT", pool_pre_ping=True)
    try:
        with engine.connect() as connection:
            exists = connection.execute(
                text("select 1 from pg_database where datname = :name"),
                {"name": target_database},
            ).scalar()
            if exists:
                print(f"Database already exists: {target_database}")
                return
            connection.execute(text(f'CREATE DATABASE "{target_database}"'))
            print(f"Database created: {target_database}")
    except OperationalError as exc:
        print("Could not connect to PostgreSQL using backend/.env credentials.")
        print(f"Details: {exc.orig}")
        raise SystemExit(1) from exc
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()

