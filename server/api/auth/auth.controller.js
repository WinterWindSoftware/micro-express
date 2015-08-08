import express from 'express';
import _ from 'lodash';
import logger from '../../components/app-logger';
import jwt from 'jsonwebtoken';
var auth = require('../../components/auth');
var router = express.Router();

router.post('/authenticate', (req, res) => {
    var user = req.body;
    if (_.isEmpty(user)) {
        return res.status(400).json({
            error: 'No credentials specifed'
        });
    }
    if (!user.username) {
        return res.status(400).json({
            error: 'Username not specified'
        });
    }
    if (!user.password) {
        return res.status(400).json({
            error: 'Password not specified'
        });
    }
    //Check for dummy 'test' user
    if (user.username !== 'test' || user.password !== 'test') {
        return res.status(401).json({
            error: 'Invalid credentials'
        });
    }
    //TODO: actually validate user credentials against DB
    var token = auth.signToken(user);
    res.json({
        token: token
    });
});

export default router;