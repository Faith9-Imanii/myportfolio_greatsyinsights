import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'portfolio_user'
    MYSQL_PASSWORD = os.getenv('DB_PASSWORD')
    MYSQL_DB = 'portfolio_db'
    MYSQL_CURSORCLASS = 'DictCursor'  # ← ADD THIS LINE
    SECRET_KEY = os.getenv('SECRET_KEY')