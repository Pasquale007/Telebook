import { secret } from "../index.js";
import { createConnection } from "../db.js";
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username_or_email, password } = req.body;
  const connection = createConnection();

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
};

export const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).json({ "message": "Benutzer wurde abgemeldet" });
};


//register
export const register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  const connection = createConnection();


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
              res.cookie('accessToken', accessToken);
              res.cookie('user_id', insertedData.id);
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
};