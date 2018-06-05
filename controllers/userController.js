const mongoose = require('mongoose');
const passport = require('passport');
const Local = mongoose.model('Local');
const Poll = mongoose.model('Poll');

// go to register form
exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// register step1: validate user's entries
exports.validateRegister = (req, res, next) => {
    // express-validator
    req.sanitizeBody('name');
    req.checkBody('name', 'name required').notEmpty();
    req.checkBody('password', 'password required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        // console.log(errors)
        res.render('register', { title: 'Register', body: req.body });
        return;
    }
    next();
};
// register step2: create user and save
exports.register = (req, res, next) => {
    // import schema & pwd
    const userLocal = new Local({ name: req.body.name });
    // passport-local-mongoose method
    Local.register(userLocal, req.body.password, (err) => {
        if (err) {
            // console.log(err);
            next(err);
        }
    });
    next(null, userLocal);
};

// go to login form
exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// login with passport strategies
// LOCAL= name & pwd
exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'failed login!',
    successRedirect: '/polls',
    successFlash: 'You are logged in!',
});
// facebook and twitter
exports.facebook = passport.authenticate('facebook', {
    failureRedirect: '/register',
    failureFlash: 'failed login!',
    successRedirect: '/polls',
    successFlash: 'You are logged in!',
});

exports.twitter = passport.authenticate('twitter', {
    failureRedirect: '/register',
    failureFlash: 'failed login!',
    successRedirect: '/polls',
    successFlash: 'You are logged in!',
});

// logout
exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/');
};

// verify if user is loggedin user
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'You must be logged in');
        res.redirect('/login');
    }
};

// verify if user has already made a choice in poll
exports.hasVoted = async (req, res, next) => {
    const cookie = req.headers.cookie.split('=')[1];
    const vote = await Poll.findOne({ slug: req.params.slug, voters: cookie });
    if (vote) {
        req.flash('error', 'You already made a choice!');
        res.redirect('back');
    } else {
        next();
    }
};

/*
// **************utilisée en dev pr vérifier si auth fail or success*************
***renvoie Error: Can't set headers after they are sent, dc uniqt pr verif auth ensuite, virer***
exports.facebook = (req, res, next) => {
    passport.authenticate('facebook', (err, user, info) => {
        if(err) {
            next(err); // generate a 500 error
        }
        if(!user) {
            // dev mode :
            res.send({ success: false, message: 'auth failed'});
            //res.redirect('/');
        }
        // dev mode : 
        res.send({ success: true, message: 'auth succeeded', "user": user});
        //res.redirect('/');
    })(req, res, next);
};
//******************************************************
 */