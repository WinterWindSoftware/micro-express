import express from 'express';
var router = express.Router();

router.get('/', (req, res) => {
    res.json({msg: 'ok'});
});

export default router;