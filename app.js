const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const { PORT, DB_URL } = require('./Config');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));


async function start() {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, })
        await app.listen(PORT)
        console.log(`Server is UP & running on port ${PORT}!`);
    } catch (error) {
        console.log('error', error)
    }
}
start()


const Routers = require('./routes');
app.use('/api/v1', Routers);
app.all('*', (req, res) => res.status(501).json({ status: 501, success: false, data: null, message: 'Not implemented!' }))


/*
|-------------------------------------------
| Error handling  Here
|-------------------------------------------
*/
app.use((err, req, res, next) => {
    if (!err) {
        return next();
    }
    if (typeof err === 'string') {
        return res.status(400).json({ status: 400, success: false, data: null, message: err });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ status: 400, success: false, data: null, message: err.message });
    } else if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ status: 401, success: false, data: null, message: 'Invalid Token' });
    } else if (err.name === 'CastError') {
        return res.status(404).json({ status: 404, success: false, data: null, message: 'Data was not found' });
    } 
    return res.status(404).json({ status: 404, success: false, data: null, message: err.message });
});

module.exports = app;