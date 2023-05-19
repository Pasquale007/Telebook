import { secret } from "../index.js";
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.cookies.accessToken;
    const user_id = parseInt(req.cookies.user_id);
    
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
