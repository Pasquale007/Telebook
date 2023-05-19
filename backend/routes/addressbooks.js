import express from "express";
import { createAddressbook, getAddressbook, updateAddressbook, deleteAddressbook, getAddressbooks } from "../controllers/addressbooks.js";
import { authenticate } from "../controllers/middleware.js";
import { check } from 'express-validator';

const router = express.Router()

router.post('/', authenticate, [
    check('user_id').notEmpty(),
    check('name').notEmpty()
], createAddressbook);

router.get('/:user_id/get', authenticate, getAddressbooks);

router.get('/:user_id/get/:addressbook_id', authenticate, getAddressbook);

router.put('/:address_book_id', authenticate, [
    check('name', "Es wird der neue Name des Adressbuches benötigt").notEmpty()], updateAddressbook);

router.delete('/:addressbook_id/get/:contact_id', authenticate, deleteAddressbook);

export default router;