import express from 'express';
import logger from '../../components/app-logger';
var router = express.Router();

router.get('/', (req, res) => {
    res.json({msg: 'ok'});
});

export default router;