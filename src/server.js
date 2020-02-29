const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportMiddleware = require('./middleware/passport');
const cors = require('cors');

const config = require('./config/config');
const routes = require('./route');
const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(passport.initialize());
passport.use(passportMiddleware);

app.get('/', function(req, res) {
    res.send('Hello! The Api is at http://localhost: ' + port + '/api');
});

app.use(cors());
app.use('/api', routes);
mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open', () => console.log('Mongodb connection established successfully!'));

connection.on('error', (err) => {
    console.log('Mongodb connection error: ' + err);
    process.exit();
});
    
app.listen(port);
console.log('There will be dragons' + port);
