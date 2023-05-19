import express from "express";
import { login, logout, register } from "../controllers/auth.js";
import { check } from "express-validator";

const router = express.Router()

router.post("/login", [
    check('username_or_email', 'Gib eine Email oder ein Benutzernamen an.').exists(),
    check('password', 'Ein Passwort wird benötigt.').exists()
], login);

router.post("/register", [
    check('name', 'Gib Benutzernamen an.').exists(),
    check('email', 'Gib eine valide Email an.').isEmail(),
    check('password', 'Ein Passwort wird benötigt.').exists()
], register);

router.post("/logout", logout);


export default router;