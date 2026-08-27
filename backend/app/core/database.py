from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import AsyncAdaptedQueuePool
from app.core.config import database_connection_options


database_url, connect_args = database_connection_options()

engine = create_async_engine(
    database_url,
    poolclass =  AsyncAdaptedQueuePool,
    pool_size = 10,
    max_overflow = 10,
    pool_timeout = 30,
    pool_recycle = 1800,
    pool_pre_ping = True,
    echo=False,
    future=True,
    connect_args=connect_args,
)

Base = declarative_base()

asyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with asyncSessionLocal() as session:
        yield session