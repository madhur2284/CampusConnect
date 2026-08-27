from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import AsyncAdaptedQueuePool
from app.core.config import settings


engine = create_async_engine(
    settings().DATABASE_URL,
    poolclass =  AsyncAdaptedQueuePool,
    pool_size = 10,
    max_overflow = 10,
    pool_timeout = 30,
    pool_recycle = 1800,
    pool_pre_ping = True,
    echo=False,
    future=True,
    connect_args={"ssl": "require"},
)

Base = declarative_base()

asyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with asyncSessionLocal() as session:
        yield session