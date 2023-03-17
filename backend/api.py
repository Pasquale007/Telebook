# FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status
from typing import Optional

from pydantic import BaseModel
# MySQL Connector
import pymysql.cursors

# zusätzlich
import json


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
connection = pymysql.connect(
    host=config.get('host'),
    user=config.get('user'),
    password=config.get('password'),
    database=config.get('database'),
    cursorclass=pymysql.cursors.DictCursor)


# ======================================== USER ========================================

class UserLogin(BaseModel):
    name: str
    password: str


class UserSignUp(BaseModel):
    name: str
    password: str
    email: str

# get username/passwd


@app.post("/login")
def login(user: UserLogin):
    with connection.cursor() as cursor:
        string = ''' 
            SELECT *
            FROM users
            WHERE
            name = %s AND password = MD5(%s);
        '''
        cursor.execute(string, (user.name, user.password))
        return cursor.fetchone()

# create


@app.post("/signup")
def signup(user: UserSignUp):
    with connection.cursor() as cursor:
        string = '''
            INSERT INTO users (name, email, password, role)
            VALUES (%s, %s, MD5(%s), "user")
        '''
        num = cursor.execute(string, (user.name, user.email, user.password))
        if num >= 1:
            return {"message": "Benutzer '{user.name}'wurde erfolgreich erstellt!"}
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Bei der Erstellung des Benutzer ist ein Felher aufgetreten. Bitte versuche es später erneut.",
        )

# ======================================== Adressbücher ========================================


class Addressbook(BaseModel):
    user_id: int
    name: str

# create


@app.post("/addressbook")
def create_addressbooks(addressbook: Addressbook):
    with connection.cursor() as cursor:
        # Check if an address book with same name already exists in the db
        cursor.execute(
            "SELECT id FROM address_books WHERE name = %s", (addressbook.name,))
        existing_addressbook = cursor.fetchone()
        if existing_addressbook:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Es existiert schon ein Adressbuch mit diesem Namen. Bitte ändere diesen Namen.",
            )

        string = ''' 
            INSERT INTO address_books (user_id, name) 
            VALUES (%s, %s);
        '''
        num = cursor.execute(string, (addressbook.user_id, addressbook.name))
        if num >= 1:
            return {"message": f"Adressbuch '{addressbook.name}' wurde erfolgreich erstellt!"}
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Bei der Erstellung des Adressbuches ist ein Felher aufgetreten. Bitte versuche es erneut.",
        )

# get


@app.get("/addressbook")
def get_all_addressbooks():
    with connection.cursor() as cursor:
        cursor.execute(" SELECT * FROM address_books;")
        return cursor.fetchall()

# get id


@app.get("/addressbook/{addressbook_id}")
def get_one_addressbooks(addressbook_id: int):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM address_books WHERE id = %s;", addressbook_id)
        result = cursor.fetchone()
        if result:
            return result
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Adressbuch nicht gefunden",
        )

# update


@app.put("/addressbook/{addressbook_id}")
def update_addressbooks(addressbook_id: int, new_addressbook: Addressbook):
    with connection.cursor() as cursor:
        # Check if address book exists
        cursor.execute(
            "SELECT id FROM address_books WHERE id = %s", addressbook_id)
        existing_addressbook = cursor.fetchone()
        if not existing_addressbook:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Das Adressbuch existiert nicht.",
            )

        # Check if updated address book name already exists
        cursor.execute(
            "SELECT id FROM address_books WHERE name = %s", new_addressbook.name)
        existing_addressbook = cursor.fetchone()
        if existing_addressbook:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ein Adressbuch mit diesem Namen existiert bereits. Bitte wähle einen anderen Namen.",
            )

        # if everything is ok -> update the address book
        string = '''
            UPDATE address_books 
            SET  name = %s 
            WHERE id = %s;
        '''
        old_name = updated_addressbook.name
        num = cursor.execute(string, (new_addressbook.name, addressbook_id))
        if num >= 1:
            return {"message": f"Das Adressbuch wurde zu '{old_name}' umgenannt."}

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Das Adressbuch konnte nicht aktualisiert werden. Bitte versuche es später erneut.",
        )

# delete


@app.delete("/addressbook/{addressbook_id}")
def delete_addressbooks(addressbook_id: int):
    with connection.cursor() as cursor:
        num = cursor.execute(
            "DELETE FROM address_books WHERE id = %s", addressbook_id)
        if num >= 1:
            return {"message": "Das Adressbuch wurde gelöscht"}
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Das Adressbuch konnte nicht gefunden werden.",
        )

# ======================================== Kontakte ========================================


class Contact(BaseModel):
    first_name: str
    last_name:  Optional[str] = None
    email: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None

# TODO: add phone numbers nicht in extra table sondern hier mit
# create
@app.post("/addressbook/{addressbook_id}/contact")
def create_contact(addressbook_id: int, contact: Contact):
    with connection.cursor() as cursor:
        string = ''' 
            INSERT INTO contacts (address_book_id, first_name, last_name, email, street, city, zip_code) 
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        '''
        num = cursor.execute(string, (addressbook_id, contact.first_name, contact.last_name,
                             contact.email, contact.street, contact.city, contact.zip_code))
        if num >= 1:
            return {"message": "Der Eint4rrag wurde hinzugefügt"}
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Es konnte kein Eintrag erstellt werden. Bitte versuche es später erneut.",
        )


# get
@app.get("/addressbook/{addressbook_id}/contact")
def get_all_contact(addressbook_id: int):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM contacts WHERE address_book_id = %s;", addressbook_id)
        return cursor.fetchall()


# get id
@app.get("/addressbook/{addressbook_id}/contact/{contact_id}")
def get_one_contact(addressbook_id: int, contact_id: int):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM contacts WHERE address_book_id = %s AND id = %s;", (addressbook_id, contact_id))
        result = cursor.fetchone()
        if result:
            return result
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kontakt nicht gefunden",
        )


# update
@app.put("/addressbook/{addressbook_id}/contact/{contact_id}")
def update_contact(addressbook_id: int, contact_id: int, new_contact: Contact):
    # Check if contact exists in addressbook
        cursor.execute(
            "SELECT id FROM contacts WHERE addressbook_id = %s AND id = %s", (addressbook_id, contact_id))
        existing_contact = cursor.fetchone()
        if not existing_contact:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Der Kontakt existiert nicht.",
            )

        # Check if updated contact name already exists in addressbook
        # -> macht das Sinn? Es gibt ja sicher mehrere Felix Müller
        cursor.execute(
            "SELECT id FROM contact WHERE addressbook_id = %s AND fist_name = %s AND last_name = %s", (addressbook_id, new_contact.first_name, new_contact.last_name))
        existing_contact = cursor.fetchone()
        if existing_contact:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ein Kontakt mit diesem Vor- und Nachnamen existiert bereits. Bitte wähle einen anderen Namen.",
            )

        # if everything is ok -> update the contact
        string = '''
            UPDATE contacts 
            SET  name = %s 
            WHERE id = %s;
        '''
        old_name = new_contact.first_name
        num = cursor.execute(string, (new_addressbook.name, addressbook_id))
        if num >= 1:
            return {"message": f"Der Kontakt wurde aktualisiert."}

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Der Kontakt konnte nicht aktualisiert werden. Bitte versuche es später erneut.",
        )


# delete
@app.put("/addressbook/{addressbook_id}/contact/{contact_id}")
def delete_contact(addressbook_id: int, contact_id: int, new_contact: Contact):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM contacts WHERE address_book_id = %s AND id = %s;", (addressbook_id, contact_id))
        return cursor.fetchone()
