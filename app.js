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


app.get('/', (req, res) => {
    res.send('Hello, Express!');
});