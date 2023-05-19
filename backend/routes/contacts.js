import express from "express";
import { createContact, getContact, getContacts, updateContact, deleteContact } from "../controllers/contacts.js";
import { authenticate } from "../controllers/middleware.js";
import { check } from 'express-validator';

const router = express.Router()

router.post('/:addressbook_id/contact', authenticate, [
  check('first_name', "Es wird ein Vorname benötigt").notEmpty(),
], createContact);

router.get('/:addressbook_id/contact', authenticate, getContacts);

router.get('/:addressbook_id/contact/:contact_id', authenticate, getContact);

router.put('/:addressbook_id/contact/:contact_id', authenticate, [
  check('first_name', "Es wird ein Vorname benötigt").notEmpty(),
], updateContact);

router.delete('/:addressbook_id/contact/:contact_id', authenticate, deleteContact);

export default router;