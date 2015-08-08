import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import { sessionSecret } from '../config';

export function isAuthenticated() {
    return expressJwt({
        secret: sessionSecret
    });
}

export function loadToken(req, res, next) {
    // Allow token to be also read from query string
    if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
    }
    // TODO: also allow token to be read from cookie
    next();
}

export function signToken(user) {
    return jwt.sign(user, sessionSecret, {
        expiresInMinutes: 60 * 24 // expires in 24 hours
    });
}
