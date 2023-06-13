import { validationResult } from 'express-validator';
import { createConnection } from "../db.js";

export const createContact = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { addressbook_id } = req.params;
    const { first_name, last_name, email, street, city, zip_code, birthday, phone_numbers } = req.body;
    const connection = createConnection();


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
};

export const getContacts = (req, res) => {
    const { addressbook_id } = req.params;
    const connection = createConnection();


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
};

export const getContact = (req, res) => {
    const { addressbook_id, contact_id } = req.params;

    const connection = createConnection();


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
};

export const updateContact = (req, res) => {
    const { addressbook_id, contact_id } = req.params;
    const { first_name, last_name, email, street, city, zip_code, birthday, phone_numbers } = req.body;
    const connection = createConnection();


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
            if (phone_numbers) {
                const deleteQuery = "DELETE FROM phone_numbers WHERE contact_id = ?";
                connection.query(deleteQuery, [contact_id], (err) => {
                    if (err) {
                        connection.end();
                        return res.status(400).json({ error: "Es konnte kein Kontakt aktualisiert werden. Bitte versuche es später erneut." });
                    }

                    const insertQuery = "INSERT INTO phone_numbers (contact_id, phone_number) VALUES (?, ?)";
                    let count = 0;
                    if (phone_numbers.length === 0) {
                        connection.commit();
                        connection.end();
                        return res.status(200).json({ message: "Der Kontakt wurde erfolgreich aktualisiert." });
                    }
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
};

export const deleteContact = (req, res) => {
    const connection = createConnection();

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
};