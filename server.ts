import { Address } from './src/app/address.interface';
import * as express from 'express';


const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.locals.address = null;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/address', (req, res) => {
    res.json(app.locals.address);
});

app.post('/address', (req, res) => {
    try {
        app.locals.address = req.body.address;
        res.json('OK');
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });

    }
});

app.listen(4700, () => {
    console.log('express running on port 4700');
});


