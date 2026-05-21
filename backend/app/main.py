from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import auth, categories, content, dashboard, offers, orders, products
from app.core.config import settings
from app.db.session import engine
from app.models import Base


def create_app() -> FastAPI:
    settings.upload_path
    app = FastAPI(
        title=settings.APP_NAME,
        version="1.0.0",
        description="FastAPI backend for local business storefronts, stock control, orders, offers, and admin dashboards.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.mount("/static", StaticFiles(directory=str(settings.static_path)), name="static")

    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
    app.include_router(products.router, prefix="/api/products", tags=["Products"])
    app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
    app.include_router(offers.router, prefix="/api/offers", tags=["Offers"])
    app.include_router(content.router, prefix="/api/content", tags=["Homepage Content"])
    app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

    @app.on_event("startup")
    def on_startup() -> None:
        Base.metadata.create_all(bind=engine)

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "service": settings.APP_NAME}

    return app


app = create_app()
