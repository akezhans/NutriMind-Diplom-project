from fastapi import FastAPI, Depends, HTTPException, status
import psycopg2
from psycopg2.extras import RealDictCursor
from passlib.context import CryptContext
from pydantic import BaseModel
import jwt
import datetime

app = FastAPI()

# Подключение к БД
conn = psycopg2.connect(
    dbname="NutriMind",
    user="postgres",
    password="1111",
    host="localhost",
    cursor_factory=RealDictCursor
)

# Настройка хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Секретный ключ для JWT
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"


# Модель для регистрации
class UserRegister(BaseModel):
    username: str
    email: str
    password: str


# Модель для логина
class UserLogin(BaseModel):
    username: str
    password: str


@app.post("/register")
def register(user: UserRegister):
    hashed_password = pwd_context.hash(user.password)
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING id",
                (user.username, user.email, hashed_password),
            )
            conn.commit()
            user_id = cur.fetchone()["id"]
            return {"message": "Пользователь зарегистрирован", "user_id": user_id}
    except psycopg2.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Пользователь уже существует")


@app.post("/login")
def login(user: UserLogin):
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM users WHERE username = %s", (user.username,))
        user_data = cur.fetchone()

    if not user_data or not pwd_context.verify(user.password, user_data["password"]):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    token = jwt.encode(
        {"user_id": user_data["id"], "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": token, "token_type": "bearer"}
