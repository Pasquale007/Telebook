const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { check, validationResult, cookie } = require('express-validator');
var jwt = require('jsonwebtoken');
let secret = 'secret123123';

//My sql connection
const mysql = require('mysql');
const cookieParser = require('cookie-parser');

//sql connection
const connectionData = {
  host: 'localhost',
  user: 'root',
  password: 'example',
  database: 'APP'
}

const corsConfig = {
  origin: true,
  credentials: true,
};


const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

app.post('/login', [
  check('username_or_email', 'Gib eine Email oder ein Benutzernamen an.').exists(),
  check('password', 'Ein Passwort wird benötigt.').exists()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username_or_email, password } = req.body;
  const connection = mysql.createConnection(connectionData);
  const query = `
    SELECT *
    FROM users
    WHERE (name = ? OR email = ?) AND password = MD5(?);
  `;

  connection.query(query, [username_or_email, username_or_email, password], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      connection.end();
      res.status(404).json({ message: 'Es existiert kein Benutzer mit diesen Anmeldedaten.' });
    } else {
      const user = result[0];
      const accessToken = jwt.sign({ user_id: user.id }, secret, { expiresIn: '2h' });
      const expirationDate = new Date(Date.now() + 60 * 60 * 1000 * 2);

      const insertQuery = `
        INSERT INTO access_tokens (user_id, token, expiration_date)
        VALUES (?, ?, ?);
      `;

      connection.query(insertQuery, [user.id, accessToken, expirationDate], (err, result) => {
        if (err) throw err;
        res.cookie('accessToken', accessToken);
        res.cookie('user_id', user.id);
        res.json({ ...user, access_token: accessToken });
        connection.end();
      });
    }
  });
});

app.post('/logout', [
], (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).json({ "message": "Benutzer wurde abgemeldet" });
});

// Middleware, um zu überprüfen, ob der Benutzer ein gültiges Token hat
const authenticate = (req, res, next) => {
  const authHeader = req.cookies.accessToken;
  const user_id = parseInt(req.cookies.user_id);

  /*
    DELETE /addressbook/:addressbook_id/get/:contact_id
    POST /addressbook/:addressbook_id/contact
    GET /addressbook/:addressbook_id/contact
    GET /addressbook/:addressbook_id/contact/:contact_id
  */
  if (!authHeader) {
    return res.sendStatus(401);
  }

  jwt.verify(authHeader, secret, (err, user) => {
    if (err || user.user_id !== user_id) {
      return res.sendStatus(403);
    }
    next();
  });
}

//register
app.post('/register', [
  check('name', 'Gib Benutzernamen an.').exists(),
  check('email', 'Gib eine valide Email an.').isEmail(),
  check('password', 'Ein Passwort wird benötigt.').exists()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  const connection = mysql.createConnection(connectionData);

  // Check if the user already exists
  const checkQuery = `
    SELECT *
    FROM users
    WHERE name = ? OR email = ?;
  `;

  connection.query(checkQuery, [name, email], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      connection.end();
      res.status(409).json({ message: 'Ein Benutzer existiert bereits für diese Anmeldedaten.' });
    } else {
      // Insert the new user
      const insertQuery = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, MD5(?));
       `;

      connection.query(insertQuery, [name, email, password], (err, result) => {
        if (err) throw err;

        connection.query(insertQuery, [name, email, password], (err, result) => {
          if (err) throw err;

          const insertedId = result.insertId;

          const selectQuery = `
            SELECT id, name, email
            FROM users
            WHERE id = ?;
          `;

          connection.query(selectQuery, [insertedId], (err, result) => {
            if (err) throw err;

            const insertedData = result[0];
            const accessToken = jwt.sign({ user_id: insertedData.id }, secret, { expiresIn: '2h' });
            const expirationDate = new Date(Date.now() + 60 * 60 * 1000 * 2);

            const insertQuery = `
            INSERT INTO access_tokens (user_id, token, expiration_date)
            VALUES (?, ?, ?);
          `;

            connection.query(insertQuery, [insertedData.id, accessToken, expirationDate], (err, result) => {
              if (err) throw err;
              connection.end();
              res.status(201).json({
                message: 'Benutzer erfolgreich erstellt.',
                data: { ...insertedData, access_token: accessToken }
              });
            });
          });
        });
      });
    }
  });
});

// ======================================== Adressbücher ========================================

//create 
app.post('/addressbook', authenticate, [
  check('user_id').isArray(),
  check('name').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const connection = mysql.createConnection(connectionData);

  const checkQuery = `
  SELECT a.*
  FROM address_books AS a
  INNER JOIN address_book_users AS au ON a.id = au.address_book_id
  WHERE au.user_id = ? AND a.name = ?
  `;
  connection.query(checkQuery, [req.body.user_id, req.body.name], (error, results) => {
    if (error) {
      connection.end();
      return res.status(400).json({ message: 'Ein Fehler ist aufgetreten. Versuche es später erneut.' });
    }

    if (results.length > 0) {
      connection.end();
      return res.status(409).json({ message: 'Es existiert bereits ein Adressbuch mit dem Namen ' + req.body.name + '. Bitte ändere diesen Namen.' });
    }

    const insertQuery = `
      INSERT INTO address_books (name)
      VALUES (?);
    `;
    connection.query(insertQuery, [req.body.name], (error, results) => {
      if (error) {
        connection.end();
        throw error;
      }

      const newAddressBookId = results.insertId;

      const insertUserQuery = `
        INSERT INTO address_book_users (user_id, address_book_id)
        VALUES (?, ?);
      `;
      const userIds = req.body.user_id;
      const userIdsLength = userIds.length;
      let counter = 0;
      userIds.forEach((userId) => {
        connection.query(insertUserQuery, [userId, newAddressBookId], (error, results) => {
          counter++;
          if (error) {
            connection.end();
            throw error;
          }

          if (counter === userIdsLength) {
            connection.commit();
            connection.end();
            res.json({ message: `Adressbuch '${req.body.name}' wurde erfolgreich erstellt!` });
          }
        });
      });
    });
  });
});

//get
app.get('/addressbook/:user_id/get', authenticate, (req, res) => {
  const userId = req.params.user_id;
  const connection = mysql.createConnection(connectionData);
  const query = `
    SELECT a.*
    FROM address_books AS a
    INNER JOIN address_book_users AS au ON a.id = au.address_book_id
    WHERE au.user_id = ?
  `;
  connection.query(query, [userId], (err, result) => {
    if (err) {
      throw err;
    };
    res.status(200).json(result);
    connection.end();
  });
});

//get id
app.get('/addressbook/:user_id/get/:addressbook_id', authenticate, (req, res) => {
  const user_id = req.params.user_id;
  const addressbook_id = req.params.addressbook_id;
  const query = `
    SELECT *
    FROM address_books
    INNER JOIN address_book_users ON address_books.id = address_book_users.address_book_id
    WHERE address_books.id = ? AND address_book_users.user_id = ?;
  `;

  const connection = mysql.createConnection(connectionData);

  connection.query(query, [addressbook_id, user_id], (error, results) => {
    connection.end();
    if (error) {
      throw error;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Adressbuch nicht gefunden oder Zugriff nicht erlaubt.' });
    } else {
      res.json(results[0]);
    }
  });
});

// post new user 
app.post("/add_user_to_addressbook", authenticate, (req, res) => {
  const { user_id, address_book_id } = req.body;
  const connection = mysql.createConnection(connectionData);

  const query = `
    SELECT user_id
    FROM address_book_users
    WHERE user_id = ? AND address_book_id = ?
  `;

  connection.query(query, [user_id, address_book_id], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      connection.end();
      res.json({ message: "Du bist bereits Teil dieses Kontaktbuchs" });
    } else {
      const insertQuery = `
        INSERT INTO address_book_users (user_id, address_book_id) 
        VALUES (?, ?)
      `;

      connection.query(insertQuery, [user_id, address_book_id], (err, result) => {
        if (err) throw err;
        connection.commit();
        connection.end();

        res.json({ message: "User wurde dem Adressbuch hinzugefügt" });
      });
    }
  });
});

//update
app.put('/addressbook/:address_book_id', authenticate, [
  check('name', "Es wird der neue Name des Adressbuches benötigt").notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const connection = mysql.createConnection(connectionData);

  const checkQuery = `
    SELECT *
    FROM address_books
    WHERE id = ?;
  `;
  connection.query(checkQuery, [req.params.address_book_id], (error, results) => {
    if (error) {
      connection.end();
      throw error;
    }

    if (results.length === 0) {
      connection.end();
      return res.status(404).json({ message: 'Adressbuch nicht gefunden.' });
    }

    const updateQuery = `
      UPDATE address_books
      SET name = ?
      WHERE id = ?;
    `;
    connection.query(updateQuery, [req.body.name, req.params.address_book_id], (error, results) => {
      if (error) {
        connection.end();
        throw error;
      }

      connection.commit();
      connection.end();
      res.json({ message: `Adressbuch ${req.body.name} wurde erfolgreich aktualisiert!` });
    });
  });
});

//delete
app.delete('/addressbook/:addressbook_id/get/:contact_id', authenticate, (req, res) => {
  const { addressbook_id, contact_id } = req.params;
  const query1 = `
    DELETE FROM address_book_users
    WHERE address_book_id = ?
    AND user_id = ?
  `;
  const query2 = `
    DELETE FROM address_books
    WHERE id = ?
    AND NOT EXISTS (
      SELECT * FROM address_book_users WHERE address_book_id = ?
    )
  `;
  const connection = mysql.createConnection(connectionData);
  connection.query(query1, [addressbook_id, contact_id], (err, result1) => {
    if (err) {
      res.status(400).json({ message: err })
    }
    const lines = result1.affectedRows;
    connection.query(query2, [addressbook_id, addressbook_id], (err, result2) => {
      if (err) {
        connection.end();
        res.status(400).json({ message: err })
      }
      const num = result2.affectedRows;
      if (lines > 0 && num === 0) {
        connection.commit();
        connection.end();
        return res.json({ message: 'Du hast dieses Adressbuch verlassen' });
      }
      if (num >= 1) {
        connection.end();
        return res.json({ message: 'Das Adressbuch wurde gelöscht' });
      }
      connection.end();
      return res.status(404).json({ message: 'Das Adressbuch konnte nicht gefunden werden.' })

    });
  });
});

// ======================================== Kontakte ========================================

//Create
app.post('/addressbook/:addressbook_id/contact', authenticate, [
  check('first_name', "Es wird ein Vorname benötigt").notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { addressbook_id } = req.params;
  const { first_name, last_name, email, street, city, zip_code, birthday, phone_numbers } = req.body;
  const connection = mysql.createConnection(connectionData);

  const contactQuery = `
      INSERT INTO contacts (address_book_id, first_name, last_name, email, street, city, zip_code, birthday) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  connection.query(contactQuery, [addressbook_id, first_name, last_name, email, street, city, zip_code, birthday], (err, result) => {
    if (err) {
      connection.end();
      return res.status(400).json({ error: "Es konnte kein Eintrag erstellt werden. Bitte versuche es später erneut." });
    }
    const contactId = result.insertId;

    if (phone_numbers && phone_numbers.length > 0) {
      const phoneQuery = `
          INSERT INTO phone_numbers (contact_id, phone_number)
          VALUES (?, ?)
        `;
      for (const phone_number of phone_numbers) {
        connection.query(phoneQuery, [contactId, phone_number], (err) => {
          if (err) {
            connection.end();
            return res.status(400).json({ message: "Es konnte kein Eintrag erstellt werden. Bitte versuche es später erneut." });

          }
        });
      }
    }

    connection.commit();
    connection.end();
    return res.status(201).json({
      message: "Der Kontakt wurde hinzugefügt.",
      id: contactId
    });
  });
});

// get
app.get('/addressbook/:addressbook_id/contact', authenticate, (req, res) => {
  const { addressbook_id } = req.params;
  const connection = mysql.createConnection(connectionData);

  const queryString = `
    SELECT c.*, GROUP_CONCAT(p.phone_number) AS phone_numbers 
    FROM contacts c 
    LEFT JOIN phone_numbers p 
    ON c.id = p.contact_id 
    WHERE c.address_book_id = ? 
    GROUP BY c.id;
  `;

  connection.query(queryString, [addressbook_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut." });
    }

    const contacts = results.map(entry => {
      const phone_numbers = entry['phone_numbers'];
      if (phone_numbers) {
        entry['phone_numbers'] = phone_numbers.split(',');
      } else {
        entry['phone_numbers'] = [];
      }
      return entry;
    });

    res.json(contacts);
  });

  connection.end();
});

// get id
app.get('/addressbook/:addressbook_id/contact/:contact_id', authenticate, (req, res) => {
  const { addressbook_id, contact_id } = req.params;
  const connection = mysql.createConnection(connectionData);

  const query = `
    SELECT c.*, GROUP_CONCAT(p.phone_number) AS phone_numbers
    FROM contacts c
    LEFT JOIN phone_numbers p
    ON c.id = p.contact_id
    WHERE c.address_book_id = ? AND c.id = ?;
  `;

  connection.query(query, [addressbook_id, contact_id], (error, results) => {
    connection.end();
    if (error) {
      res.status(400).json({ error: 'Es konnte kein Kontakt gefunden werden.' });
      return;
    }
    if (results.length > 0) {
      const result = results[0];
      const phone_numbers = result.phone_numbers;
      if (phone_numbers) {
        result.phone_numbers = phone_numbers.split(',');
      } else {
        result.phone_numbers = [];
      }
      res.json(result);
    } else {
      res.status(404).json({ error: 'Kontakt nicht gefunden.' });
    }
  });
});

//update
app.put('/addressbook/:addressbook_id/contact/:contact_id', authenticate, [
  check('first_name', "Es wird ein Vorname benötigt").notEmpty(),
], (req, res) => {
  const { addressbook_id, contact_id } = req.params;
  const { first_name, last_name, email, street, city, zip_code, birthday, phone_numbers } = req.body;
  const connection = mysql.createConnection(connectionData);

  connection.query("SELECT id FROM contacts WHERE address_book_id = ? AND id = ?", [addressbook_id, contact_id], (err, existing_contact) => {
    if (err) {
      connection.end();
      return res.status(400).json({ error: "Der Kontakt existiert nicht." });
    }

    if (!existing_contact || existing_contact.length === 0) {
      connection.end();
      return res.status(404).json({ error: "Der Kontakt existiert nicht." });
    }

    const contactQuery = `
        UPDATE contacts 
        SET first_name = ?, last_name = ?, email = ?, street = ?, city = ?, zip_code = ?, birthday = ?
        WHERE id = ? AND address_book_id = ?
      `;
    connection.query(contactQuery, [first_name, last_name, email, street, city, zip_code, birthday, contact_id, addressbook_id], (err) => {
      if (err) {
        connection.end();
        return res.status(400).json({ error: "Es konnte kein Kontakt aktualisiert werden. Bitte versuche es später erneut." });
      }

      if (phone_numbers && phone_numbers.length > 0) {
        const deleteQuery = "DELETE FROM phone_numbers WHERE contact_id = ?";
        connection.query(deleteQuery, [contact_id], (err) => {
          if (err) {
            connection.end();
            return res.status(400).json({ error: "Es konnte kein Kontakt aktualisiert werden. Bitte versuche es später erneut." });
          }

          const insertQuery = "INSERT INTO phone_numbers (contact_id, phone_number) VALUES (?, ?)";
          let count = 0;

          phone_numbers.forEach(phone_number => {
            if (phone_number.length === 0) {
              count++;
              return;
            }

            connection.query(insertQuery, [contact_id, phone_number], (err) => {
              if (err) {
                connection.end();
                return res.status(400).json({ error: "Es konnte kein Kontakt aktualisiert werden. Bitte versuche es später erneut." });
              }

              count++;

              if (count === phone_numbers.length) {
                connection.commit();
                connection.end();
                return res.status(200).json({ message: "Der Kontakt wurde erfolgreich aktualisiert." });
              }
            });
          });
        });
      } else {
        connection.commit();
        connection.end();
        return res.status(200).json({ message: "Der Kontakt wurde erfolgreich aktualisiert." });
      }
    });
  });
});

//delete
app.delete('/addressbook/:addressbook_id/contact/:contact_id', authenticate, (req, res) => {
  const connection = mysql.createConnection(connectionData);
  connection.query(
    'DELETE FROM contacts WHERE address_book_id = ? AND id = ?',
    [req.params.addressbook_id, req.params.contact_id],
    (err, results) => {
      if (err) {
        connection.end();
        return res.status(400).json({ message: "Der Eintrag konnte nicht gelöscht werden." });
      }
      connection.commit();
      connection.end();
      if (results.affectedRows === 1) {
        return res.status(200).json({ message: 'Der Kontakt wurde erfolgreich gelöscht.' });
      }
      return res.status(400).json({ message: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut." });
    }
  );
});

app.listen(8000, () => console.log('Telebook is listening on port 8000.'));