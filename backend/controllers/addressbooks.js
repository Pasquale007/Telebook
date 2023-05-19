import { validationResult } from 'express-validator';
import { createConnection } from "../db.js";

export const createAddressbook = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const connection = createConnection();

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
};

export const getAddressbooks = (req, res) => {
    const userId = req.params.user_id;
    const connection = createConnection();

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
};

export const getAddressbook = (req, res) => {
    const user_id = req.params.user_id;
    const addressbook_id = req.params.addressbook_id;
    const query = `
          SELECT *
          FROM address_books
          INNER JOIN address_book_users ON address_books.id = address_book_users.address_book_id
          WHERE address_books.id = ? AND address_book_users.user_id = ?;
        `;

    const connection = createConnection();


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
};

export const updateAddressbook = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const connection = createConnection();


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
};

export const deleteAddressbook = (req, res) => {
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
    const connection = createConnection();

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
};