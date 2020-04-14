const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportMiddleware = require('./middleware/passport');
const cors = require('cors');
const expressValidator = require('express-validator');

const config = require('./config/config');
const port = process.env.PORT || 5000;
const app = express();

//bring in routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const groupRoutes = require('./routes/group');

//middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(passport.initialize());
passport.use(passportMiddleware);
app.use(cors());
app.use('/api', authRoutes, postRoutes, groupRoutes);

//db connection
mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});
const connection = mongoose.connection;
connection.once('open', () => console.log('Mongodb connection established successfully!'));
connection.on('error', (err) => {
    console.log('Mongodb connection error: ' + err);
    process.exit();
});
    
app.listen(port);
console.log('There will be dragons' + port);
