import express from "express";
import { addUser } from "../controllers/addUser.js";
import { authenticate } from "../controllers/middleware.js";

const router = express.Router()

// add new user to addressbook
router.post("/", authenticate, addUser);
export default router;