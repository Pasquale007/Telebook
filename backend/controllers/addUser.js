import { createConnection } from "../db.js";

export const addUser = (req, res) => {
    const { user_id, address_book_id } = req.body;
    const connection = createConnection();

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
}