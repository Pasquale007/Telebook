import express from "express";
import authRoutes from "./routes/auth.js";
import addressbookRoutes from "./routes/addressbooks.js";
import contactsRoutes from "./routes/contacts.js";
import addUserRoutes from "./routes/addUser.js";
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

export const secret = 'secret123123';

const corsConfig = {
  origin: true,
  credentials: true,
};

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

app.use("/auth", authRoutes);
app.use("/addressbook", addressbookRoutes);
app.use("/contacts", contactsRoutes);
app.use("/add_user_to_addressbook", addUserRoutes);

app.listen(8000, () => console.log('Telebook is listening on port 8000.'));