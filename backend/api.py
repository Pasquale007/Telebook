# FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# MySQL Connector
import pymysql.cursors

app = FastAPI()
# configs for FastAPI
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# specify database configurations
config = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'example',
    'database': 'APP'
}

# Connect to the database
connection = pymysql.connect(host=config.get('host'),
                             user=config.get('user'),
                             password=config.get('password'),
                             database=config.get('database'),
                             cursorclass=pymysql.cursors.DictCursor)

@app.get("/")
def read_root():
    with connection.cursor() as cursor:
        # Read a single record
        #cursor.execute("SELECT user_name, user_email, user_password FROM USERS WHERE user_name = 'user'")
        cursor.execute("SELECT * FROM USERS;")
        return cursor.fetchall()