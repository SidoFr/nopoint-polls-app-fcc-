const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo') (session);
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const errorHandlers = require('./modules/errorHandlers');
const routes = require('./routes/index');
const helper = require('./helper');
require('./modules/passport');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

// impt! -> session
// allows us to store data on visitors from req to req
// keeps users logged in!!
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// pass variables to templates and to requests!
app.use((req, res, next) => {
    res.locals.h = helper;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

app.use('/', routes);
// if route error
app.use(errorHandlers.notFound);

// error handler in dev
if (app.get('env' === 'development')) {
    app.use(errorHandlers.devErrors);
}

// error handler in prod
app.use(errorHandlers.prodErrors);

module.exports = app;