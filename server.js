import express from 'express';
let app = express();

app.get('/', (req, res) => {
    res.send('hello there world');
});

var server = app.listen(5000, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});