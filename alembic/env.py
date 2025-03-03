import asyncio
from logging.config import fileConfig
from alembic import context
from database import engine  # Асинхронный движок
from models import Base

# Настройки Alembic
config = context.config

# Логирование
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Мета-данные моделей
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Запускаем миграции в offline-режиме."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """Запускаем миграции в online-режиме для асинхронного движка."""
    async with engine.begin() as connection:
        await connection.run_sync(context.run_migrations)

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
