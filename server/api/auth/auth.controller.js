import express from 'express';
import _ from 'lodash';
import logger from '../../components/app-logger';
import jwt from 'jsonwebtoken';
var router = express.Router();

router.post('/authenticate', (req, res) => {
    var user = req.body;
    if(_.isEmpty(user)) {
        return res.status(400).json({error: 'No credentials specifed'});
    }
    if(!user.username) {
        return res.status(400).json({error: 'Username not specified'});
    }
    if(!user.password) {
        return res.status(400).json({error: 'Password not specified'});
    }
    //TODO: actually validate user credentials against DB
    var token = jwt.sign(user, 'TODO: read session secret from excluded file', {
        expiresInMinutes: 60 * 24 // expires in 24 hours
    });
    res.json({
        token: token
    });
});

export default router;